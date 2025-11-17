import Job from "../../models/job.model.js";
import SavedJob from "../../models/savedJob.model.js";
import { createNotification } from "../../utils/createSystemNotification.js";

/**
 * @desc Apply for Job
 */
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const authUser = req.user;
    const driverId = authUser.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.isExpired || job.status !== "open")
      return res.status(400).json({ success: false, message: "Job is closed or expired" });

    // Find existing application
    const existingApp = job.applicants.find(
      (a) => a.driverId.toString() === driverId.toString()
    );

    // If exists and not withdrawn → block
    if (existingApp && existingApp.status !== "withdrawn") {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // If exists but withdrawn // reapply
    if (existingApp && existingApp.status === "withdrawn") {
      existingApp.status = "applied";
      existingApp.appliedAt = new Date();
    } else {
      // Fresh application
      job.applicants.push({ driverId });
    }

    await job.save();

    // Notification to owner
    await createNotification({
      userId: job.ownerId,
      title: "New Job Application",
      message: `A driver has applied for your job "${job.title}".`,
      type: "application",
      relatedId: job._id,
      onModel: "Job",
    });

    return res.status(200).json({
      success: true,
      message: "Job application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ success: false, message: "Server error applying for job" });
  }
};


/**
 * @desc Withdraw job application
 */
export const withdrawApplication = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const authUser = req.user;
    const driverId = authUser.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // find applicant entry
    const applicant = job.applicants.find(
      (a) => a.driverId.toString() === driverId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: "You have not applied for this job." });
    }

    // If already withdrawn
    if (applicant.status === "withdrawn") {
      return res.status(400).json({ success: false, message: "Application already withdrawn." });
    }

    // If already accepted, disallow withdrawal (business rule)
    if (applicant.status === "accepted") {
      return res.status(400).json({ success: false, message: "Cannot withdraw an accepted application. Contact the owner." });
    }

    // If rejected, nothing to withdraw
    if (applicant.status === "rejected") {
      return res.status(400).json({ success: false, message: "Application already rejected." });
    }

    // Mark as withdrawn
    applicant.status = "withdrawn";
    applicant.updatedAt = new Date();

    await job.save();

    // Notify driver
    await createNotification({
      userId: driverId,
      title: "Application Withdrawn",
      message: `You have withdrawn your application for "${job.title}".`,
      type: "application",
      relatedId: job._id,
      onModel: "Job",
    });

    // Notify owner
    await createNotification({
      userId: job.ownerId,
      title: "Driver Withdrawn Application",
      message: `A driver has withdrawn their application for your job "${job.title}".`,
      type: "application",
      relatedId: job._id,
      onModel: "Job",
    });


    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return res.status(500).json({ success: false, message: "Server error withdrawing application" });
  }
};


/**
 * @desc Get list of available jobs for drivers
 * @route GET /api/driver/jobs
 * @access Driver
 */
export const listAvailableJobs = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { city, state, vehicleType, minSalary, maxSalary, startDate, endDate, keyword, page = 1, limit = 10, } = req.query;
    const query = {
      status: "open",
      isExpired: false,
      endDate: { $gte: new Date() },
    };

    // Filters
    if (city) query["location.city"] = new RegExp(city, "i");
    if (state) query["location.state"] = new RegExp(state, "i");
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
      ];
    }
    if (vehicleType) {
      query.vehicleType = new RegExp(vehicleType, "i");
    }

    // Pagination setup
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Total job count
    const totalJobs = await Job.countDocuments(query);

    // Fetch paginated jobs
    const jobs = await Job.find(query)
      .populate("ownerId", "fullName companyName")
      .populate("vehicleId", "make model plateNo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Fetch all saved jobs for this driver
    const savedJobs = await SavedJob.find({ driverId }).select("jobId").lean();
    const savedJobIds = new Set(savedJobs.map((s) => s.jobId.toString()));

    // Enhance jobs with "alreadyApplied" + "isSaved"
    const enrichedJobs = jobs.map((job) => {
      const applied = job.applicants?.some(
        (a) => a.driverId.toString() === driverId.toString()
      );
      const isSaved = savedJobIds.has(job._id.toString());
      return { ...job, alreadyApplied: applied, isSaved };
    });

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / pageSize),
      totalJobs,
      jobs: enrichedJobs,
    });
  } catch (error) {
    console.error("Error listing available jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching job listings",
    });
  }
};


// Save a job
export const saveJob = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { jobId } = req.body;

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const alreadySaved = await SavedJob.findOne({ driverId, jobId });
    if (alreadySaved) {
      return res.status(400).json({ success: false, message: "Job already saved" });
    }

    const saved = await SavedJob.create({ driverId, jobId });
    return res.status(200).json({
      success: true,
      message: "Job saved successfully",
      saved,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({ success: false, message: "Server error saving job" });
  }
};

// Submitted Application By Driver
export const getDriverApplications = async (req, res) => {
  try {
    const driverId = req.user.id;

    // Find jobs where this driver has applied
    const jobs = await Job.find({ "applicants.driverId": driverId })
      .populate({
        path: "ownerId",
        select: "fullName companyName avatar profileImage",
      })
      .sort({ createdAt: -1 });

    // Format response for front-end
    const formatted = jobs.map((job, index) => {
      // Find this driver's application details within the job
      const application = job.applicants.find(
        (a) => a.driverId.toString() === driverId.toString()
      );

      return {
        srNo: index + 1,
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.ownerId?.companyName || `${job.ownerId?.fullName || ""}`,
        location: `${job.location.city || ""}, ${job.location.state || ""}`,
        appliedOn: application?.appliedAt || job.createdAt,
        status:
          application?.status === "applied"
            ? "In Progress"
            : application?.status === "accepted"
            ? "Approved"
            : application?.status === "rejected"
            ? "Rejected"
            : application?.status === "withdrawn"
            ? "Withdrawn"
            : "Pending",
      };
    });

    res.status(200).json({
      success: true,
      total: formatted.length,
      applications: formatted,
    });
  } catch (error) {
    console.error("Error fetching driver applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};
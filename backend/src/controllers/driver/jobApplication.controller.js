import Job from "../../models/job.model.js";
import SavedJob from "../../models/savedJob.model.js";

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

    const alreadyApplied = job.applicants.some(
      (a) => a.driverId.toString() === driverId.toString()
    );
    if (alreadyApplied)
      return res.status(400).json({ success: false, message: "You have already applied for this job" });

    job.applicants.push({ driverId });
    await job.save();

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
      .populate("ownerId", "firstName surname companyName")
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

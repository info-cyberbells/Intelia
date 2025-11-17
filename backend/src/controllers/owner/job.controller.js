import Job from "../../models/job.model.js";
import Vehicle from "../../models/vehicle.model.js";
import User from "../../models/user.model.js";
import { validateCreateJob, validateUpdateJob } from "../../validation/job.validation.js";
import { createNotification } from "../../utils/createSystemNotification.js";

/**
 * @desc Create Job (Owner)
 */
export const createJob = async (req, res) => {
  try {
    const { error } = validateCreateJob(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }
    const authUser = req.user;
    const ownerId = authUser.id;
    const jobData = { ...req.body, ownerId };

    // Optional vehicle existence check
    if (jobData.vehicleId) {
      const vehicle = await Vehicle.findOne({ _id: jobData.vehicleId, ownerId });
      if (!vehicle)
        return res.status(404).json({ success: false, message: "Vehicle not found or not owned by you" });
    }

    const job = await Job.create(jobData);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ success: false, message: "Server error creating job" });
  }
};

/**
 * @desc Update Job (Owner)
 */
export const updateJob = async (req, res) => {
  try {
    const { error } = validateUpdateJob(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    const authUser = req.user;
    const ownerId = authUser.id;
    const { jobId } = req.params;

    const job = await Job.findOne({ _id: jobId, ownerId });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    Object.assign(job, req.body);
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ success: false, message: "Server error updating job" });
  }
};

/**
 * @desc Delete Job (Owner)
 */
export const deleteJob = async (req, res) => {
  try {
    const authUser = req.user;
    const ownerId = authUser.id;
    const { jobId } = req.params;

    const job = await Job.findOneAndDelete({ _id: jobId, ownerId });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found or not authorized" });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ success: false, message: "Server error deleting job" });
  }
};

/**
 * @desc Get All Jobs (for Drivers)
 */
export const listJobs = async (req, res) => {
  try {
    const ownerId = req.user._id;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments({status: "open",isExpired: false,ownerId: ownerId,});
    const jobs = await Job.find({ status: "open", isExpired: false, ownerId: ownerId }).populate("ownerId", "fullName companyName").populate("vehicleId", "make model plateNo").skip(skip).limit(limit).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error listing jobs:", error);
    return res.status(500).json({ success: false, message: "Server error listing jobs" });
  }
};

/**
 * @desc Get Job by ID
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("ownerId", "fullName companyName").populate("vehicleId", "make model plateNo");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ success: false, message: "Server error fetching job" });
  }
};

/**
 * @desc Manage Applications (Owner)
 */
export const manageApplications = async (req, res) => {
  try {
    const { jobId, driverId } = req.params;
    const { status } = req.body; // "accepted" | "rejected" | "withdrawn"
    const ownerId = req.user._id;

    const job = await Job.findOne({ _id: jobId, ownerId });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const applicant = job.applicants.find(
      (a) => a.driverId.toString() === driverId.toString()
    );
    if (!applicant)
      return res.status(404).json({ success: false, message: "Applicant not found" });

    applicant.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'`,
    });
  } catch (error) {
    console.error("Error managing applications:", error);
    return res.status(500).json({ success: false, message: "Server error managing applications" });
  }
};

/**
 * @desc Auto Expire Jobs (Cron or Manual)
 */
export const expireJobs = async () => {
  try {
    const now = new Date();
    const expiredJobs = await Job.updateMany(
      { endDate: { $lt: now }, isExpired: false },
      { isExpired: true, status: "expired" }
    );
    console.log(`Auto-expired ${expiredJobs.modifiedCount} jobs.`);
  } catch (error) {
    console.error("Error expiring jobs:", error);
  }
};


/**
 * @desc Apply for Job (Driver)
 */
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const driverId = req.user._id;

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
 * @desc Withdraw job application (Driver)
 */
export const withdrawApplication = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const driverId = req.user._id;

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
 * @desc Get all applications for a specific job
 */
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const ownerId = req.user._id;

    const job = await Job.findOne({ _id: jobId, ownerId })
      .populate("applicants.driverId", "fullName email phone profileImage")
      .populate("vehicleId", "make model plateNo");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized." });
    }

    const baseURL = `${req.protocol}://${req.get("host")}`;

    // Attach full URL to profile image
    job.applicants = job.applicants.map(app => {
      if (app.driverId?.profileImage) {
        app.driverId.profileImage = baseURL + app.driverId.profileImage;
      }
      return app;
    });

    return res.status(200).json({
      success: true,
      message: "Job applications fetched successfully",
      totalApplications: job.applicants.length,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ success: false, message: "Server error fetching applications" });
  }
};

/**
 * @desc Get application summary by status
 */
export const getApplicationSummary = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const ownerId = req.user._id;

    const job = await Job.findOne({ _id: jobId, ownerId });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized." });
    }

    const summary = job.applicants.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { applied: 0, shortlisted: 0, accepted: 0, rejected: 0, withdrawn: 0 }
    );

    return res.status(200).json({
      success: true,
      jobId: job._id,
      summary,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ success: false, message: "Server error fetching summary" });
  }
};

/**
 * @desc Shortlist applicant
 */
export const shortlistApplicant = async (req, res) => {
  try {
    const { jobId, driverId } = req.params;
    const ownerId = req.user._id;

    //console.log('req.params',req.params);

    const job = await Job.findOne({ _id: jobId, ownerId });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized." });
    }

    const applicant = job.applicants.find(
      (a) => a.driverId.toString() === driverId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: "Applicant not found for this job." });
    }

    if (applicant.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Applicant is already shortlisted for this job.",
      });
    }

    applicant.status = "accepted";
    applicant.updatedAt = new Date();

    await job.save();

    await createNotification({
      userId: driverId,
      title:
        job.status === "accepted"
          ? "Application Accepted"
          : job.status === "rejected"
          ? "Application Rejected"
          : "Application Updated",
      message:
        job.status === "accepted"
          ? `Your application for "${job.title}" has been accepted.`
          : job.status === "rejected"
          ? `Your application for "${job.title}" has been rejected.`
          : `Your application status for "${job.title}" was updated.`,
      type: "application",
      relatedId: job._id,
      onModel: "Job",
    });


    return res.status(200).json({
      success: true,
      message: "Applicant shortlisted successfully.",
    });
  } catch (error) {
    console.error("Error shortlisting applicant:", error);
    return res.status(500).json({ success: false, message: "Server error shortlisting applicant" });
  }
};

/**
 * @desc Get all shortlisted applicants for a job
 */
export const getShortlistedApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const ownerId = req.user._id;

    const job = await Job.findOne({ _id: jobId, ownerId })
      .populate("applicants.driverId", "fullName email phone");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized." });
    }

    const shortlisted = job.applicants.filter(a => a.status === "accepted");

    return res.status(200).json({
      success: true,
      totalShortlisted: shortlisted.length,
      shortlisted,
    });
  } catch (error) {
    console.error("Error fetching shortlisted applicants:", error);
    return res.status(500).json({ success: false, message: "Server error fetching shortlisted applicants" });
  }
};
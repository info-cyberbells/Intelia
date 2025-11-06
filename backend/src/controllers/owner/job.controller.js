import Job from "../../models/job.model.js";
import Vehicle from "../../models/vehicle.model.js";
import { validateCreateJob, validateUpdateJob } from "../../validation/job.validation.js";

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
    const jobs = await Job.find({ status: "open", isExpired: false })
      .populate("ownerId", "firstName surname companyName")
      .populate("vehicleId", "make model plateNo");

    return res.status(200).json({
      success: true,
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
    const job = await Job.findById(req.params.jobId)
      .populate("ownerId", "firstName surname companyName")
      .populate("vehicleId", "make model plateNo");

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

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return res.status(500).json({ success: false, message: "Server error withdrawing application" });
  }
};

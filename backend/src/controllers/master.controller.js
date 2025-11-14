import RouteType from "../models/routeType.model.js";
import VehicleType from "../models/vehicleType.model.js";
import DriverSkill from "../models/driverSkill.model.js";
import Job from "../models/job.model.js";

// =======================
// ROUTE TYPES
// =======================
export const getRouteTypes = async (req, res) => {
  try {
    const data = await RouteType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch route types" });
  }
};

// =======================
// VEHICLE TYPES
// =======================
export const getVehicleTypes = async (req, res) => {
  try {
    const data = await VehicleType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicle types" });
  }
};

// =======================
// DRIVER SKILLS
// =======================
export const getDriverSkills = async (req, res) => {
  try {
    const data = await DriverSkill.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch driver skills" });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    // Fetch all jobs
    const jobs = await Job.find()
      .populate("ownerId", "fullName email companyName profileImage")
      .populate("vehicleId", "make model plateNo")
      .populate("applicants.driverId", "fullName email phoneNumber profileImage")
      .sort({ createdAt: -1 })
      .lean();

    const baseURL = `${req.protocol}://${req.get("host")}`;

    // Enhance jobs
    const formattedJobs = jobs.map((job) => {
      // Find hired driver
      const hiredDriver = job.applicants?.find(
        (a) => a.status === "accepted"
      );

      return {
        ...job,
        owner: job.ownerId
          ? {
              ...job.ownerId,
              profileImage: job.ownerId.profileImage
                ? baseURL + job.ownerId.profileImage
                : null,
            }
          : null,

        vehicle: job.vehicleId || null,

        hiredDriver: hiredDriver
          ? {
              ...hiredDriver.driverId,
              profileImage: hiredDriver.driverId?.profileImage
                ? baseURL + hiredDriver.driverId.profileImage
                : null,
            }
          : null,

        applicants: job.applicants.map((a) => ({
          driverId: a.driverId
            ? {
                ...a.driverId,
                profileImage: a.driverId.profileImage
                  ? baseURL + a.driverId.profileImage
                  : null,
              }
            : null,
          status: a.status,
          appliedAt: a.appliedAt,
        })),
      };
    });

    return res.json({
      success: true,
      total: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Get all jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching all jobs",
    });
  }
};


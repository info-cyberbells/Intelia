import Job from "../../models/job.model.js";
import Driver from "../../models/user.model.js";
import Application from "../../models/application.model.js";

/**
 * @desc Get all drivers hired/shortlisted by owner (across all jobs)
 * @route GET /api/owner/drivers
 * @access Private (Owner)
 */
export const getMyDrivers = async (req, res) => {
  try {
    const authUser = req.user;
    const { status = "accepted", page = 1, limit = 10 } = req.query;

    // Convert to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get all jobs by this owner
    const jobs = await Job.find({ ownerId: authUser._id })
      .populate({
        path: "applicants.driverId",
        select:
          "firstName surname phoneNumber email profileImage licenseNumber rating",
      })
      .select("title applicants");

    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        totalDrivers: 0,
        riskScore: 0,
        lowRisk: 0,
        totalLicense: 0,
        totalPages: 0,
        currentPage: pageNum,
        drivers: [],
        message: "No drivers found for this owner",
      });
    }

    // Collect applicants across all jobs
    let allApplicants = [];
    for (const job of jobs) {
      const filtered = job.applicants.filter(
        (a) =>
          status === "all" ||
          a.status.toLowerCase() === status.toLowerCase()
      );
      filtered.forEach((a) => {
        allApplicants.push({
          driver: a.driverId,
          jobTitle: job.title,
          status: a.status,
          appliedAt: a.appliedAt,
        });
      });
    }

    // Remove duplicates
    const uniqueDriversMap = new Map();
    allApplicants.forEach((a) => {
      const id = a.driver?._id?.toString();
      if (!uniqueDriversMap.has(id)) {
        uniqueDriversMap.set(id, a);
      }
    });

    const uniqueDrivers = Array.from(uniqueDriversMap.values());

    // Apply pagination (slice)
    const totalDrivers = uniqueDrivers.length;
    const totalPages = Math.ceil(totalDrivers / limitNum);
    const paginatedDrivers = uniqueDrivers.slice(skip, skip + limitNum);

    // Format output
    const formatted = paginatedDrivers.map((a) => ({
      driverId: a.driver?._id,
      driverName: `${a.driver?.firstName || ""} ${a.driver?.surname || ""}`.trim(),
      phoneNumber: a.driver?.phoneNumber,
      email: a.driver?.email,
      profileImage: a.driver?.profileImage,
      licenseNumber: a.driver?.licenseNumber,
      rating: a.driver?.rating || 0,
      appliedJob: a.jobTitle,
      status: a.status,
      appliedAt: a.appliedAt,
    }));

    return res.status(200).json({
      success: true,
      totalDrivers,
      riskScore: 999,
      lowRisk: 999,
      totalLicense: 999,
      totalPages,
      currentPage: pageNum,
      perPage: limitNum,
      drivers: formatted,
    });
  } catch (error) {
    console.error("Error fetching owner drivers:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching drivers",
    });
  }
};


export const getMyDriverProfile = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // Fetch driver basic info
    const driver = await Driver.findById(driverId)
      .select(
        "firstName surname email phoneNumber profileImage licenseNumber rating experience vehicleType createdAt"
      )
      .lean();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Fetch stats from applications
    const stats = await Application.aggregate([
      { $match: { driverId: driver._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      totalApplied: 0,
      accepted: 0,
      rejected: 0,
      shortlisted: 0,
      completed: 0,
    };

    stats.forEach((s) => {
      if (s._id === "accepted") summary.accepted = s.count;
      else if (s._id === "rejected") summary.rejected = s.count;
      else if (s._id === "shortlisted") summary.shortlisted = s.count;
      else if (s._id === "completed") summary.completed = s.count;
      summary.totalApplied += s.count;
    });

    // Combine and send
    return res.status(200).json({
      success: true,
      profile: {
        ...driver,
        totalIncidents: 0,
        milesDriven: 0,
        safetyScore:0,
        incomeIncrease:0,
        stats: summary,
      },
    });
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching driver profile",
    });
  }
};


export const searchDriverByLicense = async (req, res) => {
  try {
    const { licenseNumber } = req.query;
    if (!licenseNumber || licenseNumber.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "License number is required to search driver",
      });
    }

    // Perform a case-insensitive partial search
    const drivers = await Driver.find({
      licenseNumber: { $regex: licenseNumber, $options: "i" },
    })
      .select(
        "firstName surname email phoneNumber profileImage licenseNumber rating experience vehicleType createdAt"
      )
      .limit(10)
      .lean();

    if (!drivers || drivers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No driver found with the given license number",
      });
    }

    return res.status(200).json({
      success: true,
      totalResults: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error("Error searching driver by license:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching driver",
    });
  }
};

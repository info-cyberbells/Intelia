import Job from "../../models/job.model.js";

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


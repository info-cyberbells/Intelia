import User from "../models/user.model.js";
import fs from "fs";
import path from "path"; 
import crypto from "crypto";

// Generate temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// @desc    Get all drivers
// @route   GET /api/superAdmin/drivers
// @access  Super Admin
export const getAllDrivers = async (req, res) => {
  try {
    const { search, status, municipality, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { role: "driver" };

    // Search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { licenseNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status !== undefined) {
      query.isActive = status === "active" ? true : false;
    }

    // Municipality filter
    if (municipality) {
      query.municipality = municipality;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const drivers = await User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    const verificationPendingCount = await User.countDocuments({ role: "driver", isActive: false,  status: "pending" });

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const formattedDrivers = drivers.map((driver) => {
      const driverObj = driver.toObject();
      return {
        ...driverObj,
        profileImage: driverObj.profileImage
          ? `${baseURL}${driverObj.profileImage.startsWith("/") ? "" : "/"}${driverObj.profileImage}`
          : null,
        licensePhoto: driverObj.licensePhoto
          ? `${baseURL}${driverObj.licensePhoto.startsWith("/") ? "" : "/"}${driverObj.licensePhoto}`
          : null,
      };
    });

    res.json({
      success: true,
      data: formattedDrivers,
      verificationPendingCount: verificationPendingCount,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get single driver by ID
// @route   GET /api/superAdmin/drivers/:id
// @access  Super Admin
export const getDriverById = async (req, res) => {
  try {
    const driver = await User.findOne({_id: req.params.id,role: "driver",}).select("-password");
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const baseURL = `${req.protocol}://${req.get("host")}`;
    driver.profileImage = driver.profileImage ? `${baseURL}${driver.profileImage.startsWith("/") ? "" : "/"}${driver.profileImage}` : null,
    driver.licensePhoto = driver.licensePhoto ? `${baseURL}${driver.licensePhoto.startsWith("/") ? "" : "/"}${driver.licensePhoto}` : null,

    res.json({ success: true, data: driver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create new driver
// @route   POST /api/superAdmin/drivers
// @access  Super Admin
export const createDriver = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, licenseNumber, municipality, validUntil, password, } = req.body;
    if (!fullName || !password || !email || !phoneNumber || !licenseNumber || !municipality || !validUntil) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check duplicates
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const existingLicense = await User.findOne({ licenseNumber });
    if (existingLicense)
      return res.status(400).json({ success: false, message: "License number already exists" });

    if (new Date(validUntil) <= new Date())
      return res.status(400).json({ success: false, message: "Valid Until date must be in the future" });

    const profileImage = req.files?.profileImage ? `/uploads/profiles/${req.files.profileImage[0].filename}`: null;
    const licensePhoto = req.files?.licensePhoto ? `/uploads/profiles/${req.files.licensePhoto[0].filename}` : null;

    // Create driver
    const driver = await User.create({
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      municipality,
      validUntil,
      password: password,
      role: "driver",
      profileImage,
      licensePhoto,
      isActive: true,
      status: "approved",
    });

    const driverResponse = driver.toObject();
    delete driverResponse.password;

    const baseURL = `${req.protocol}://${req.get("host")}`;
    driverResponse.profileImage = req.files?.profileImage ? `${baseURL}/uploads/profiles/${req.files.profileImage[0].filename}`: null;
    driverResponse.licensePhoto = req.files?.licensePhoto ? `${baseURL}/uploads/profiles/${req.files.licensePhoto[0].filename}` : null;

    res.status(201).json({
      success: true,
      message: "Driver created successfully.",
      data: driverResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// @desc    Update driver
// @route   PUT /api/superAdmin/drivers/:id
// @access  Super Admin
export const updateDriver = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, licenseNumber, municipality, validUntil } = req.body;
    const driver = await User.findOne({ _id: req.params.id, role: "driver" });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Duplicate email check
    if (email && email !== driver.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Duplicate license check
    if (licenseNumber && licenseNumber !== driver.licenseNumber) {
      const existingLicense = await User.findOne({ licenseNumber });
      if (existingLicense)
        return res.status(400).json({ success: false, message: "License number already exists" });
    }

    // Date validation
    if (validUntil && new Date(validUntil) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Valid Until date must be in the future",
      });
    }

    if (req.files?.profileImage) {
      const newProfilePath = `/uploads/profiles/${req.files.profileImage[0].filename}`;
      // Delete old profile image if exists
      if (driver.profileImage) {
        const oldPath = path.join(process.cwd(), driver.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      driver.profileImage = `${newProfilePath}`;
    }

    if (req.files?.licensePhoto) {
      const newLicensePath = `/uploads/profiles/${req.files.licensePhoto[0].filename}`;
      // Delete old license image if exists
      if (driver.licensePhoto) {
        const oldPath = path.join(process.cwd(), driver.licensePhoto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      driver.licensePhoto = `${newLicensePath}`;
    }

    if (fullName) driver.fullName = fullName;
    if (email) driver.email = email;
    if (phoneNumber) driver.phoneNumber = phoneNumber;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (municipality) driver.municipality = municipality;
    if (validUntil) driver.validUntil = validUntil;

    await driver.save();
    // Clean response
    const driverResponse = driver.toObject();
    delete driverResponse.password;

    const baseURL = `${req.protocol}://${req.get("host")}`;
    driverResponse.profileImage = req.files?.profileImage ? `${baseURL}/uploads/profiles/${req.files.profileImage[0].filename}`: null;
    driverResponse.licensePhoto = req.files?.licensePhoto ? `${baseURL}/uploads/profiles/${req.files.licensePhoto[0].filename}` : null;

    res.status(200).json({
      success: true,
      message: "Driver updated successfully.",
      data: driverResponse,
    });
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).json({ success: false, message: "Server error while updating driver." });
  }
};

// @desc    Delete driver
// @route   DELETE /api/superAdmin/drivers/:id
// @access  Super Admin
export const deleteDrivers = async (req, res) => {
  try {
    const { ids } = req.body; // Expect array of driver IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of driver IDs to delete",
      });
    }

    // Find all matching drivers
    const drivers = await User.find({ _id: { $in: ids }, role: "driver" });

    if (!drivers.length) {
      return res.status(404).json({
        success: false,
        message: "No drivers found for provided IDs",
      });
    }

    // Delete profile images if exist
    for (const driver of drivers) {
      if (driver.profileImage) {
        const imagePath = `.${driver.profileImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // Delete all drivers in one go
    await User.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${drivers.length} driver(s) deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting drivers:", err);
    res.status(500).json({ success: false, message: "Server error while deleting drivers" });
  }
};

// @desc    Toggle driver status (Active/Inactive)
// @route   PATCH /api/superAdmin/drivers/:id/toggle-status
// @access  Super Admin
export const toggleDriverStatus = async (req, res) => {
  try {
    const driver = await User.findOne({_id: req.params.id,role: "driver",});
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.isActive = !driver.isActive;
    await driver.save();

    res.json({
      success: true,
      message: `Driver ${driver.isActive ? "activated" : "deactivated"} successfully`,
      data: {
        _id: driver._id,
        isActive: driver.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get driver statistics
// @route   GET /api/superAdmin/drivers/stats
// @access  Super Admin
export const getDriverStats = async (req, res) => {
  try {
    const totalDrivers = await User.countDocuments({ role: "driver" });
    const activeDrivers = await User.countDocuments({ role: "driver", isActive: true });
    const inactiveDrivers = await User.countDocuments({ role: "driver", isActive: false });

    // Drivers with expiring licenses (within next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringLicenses = await User.countDocuments({
      role: "driver",
      validUntil: { $lte: thirtyDaysFromNow, $gte: new Date() },
    });

    res.json({
      success: true,
      data: {
        total: totalDrivers,
        active: activeDrivers,
        inactive: inactiveDrivers,
        expiringLicenses: expiringLicenses,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get municipalities list (for dropdown)
// @route   GET /api/superAdmin/drivers/municipalities
// @access  Super Admin
export const getMunicipalities = async (req, res) => {
  try {
    const municipalities = await User.distinct("municipality", { role: "driver" });
    
    res.json({
      success: true,
      data: municipalities.filter(m => m), // Remove null/empty values
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
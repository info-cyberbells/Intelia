import User from "../models/user.model.js";
import fs from "fs";
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
    res.json({
      success: true,
      data: drivers,
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
    const {firstName,surname,email,phoneNumber,licenseNumber,municipality,vehicleRegistration,validUntil,} = req.body;
    // Validate required fields
    if (!firstName || !surname || !email || !phoneNumber || !licenseNumber || !municipality || !validUntil) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if license number already exists
    const existingLicense = await User.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: "License number already exists",
      });
    }

    // Validate validUntil is in the future
    if (new Date(validUntil) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Valid Until date must be in the future",
      });
    }

    // Generate temporary password
    // const tempPassword = generateTempPassword();
    const tempPassword = 'Test@123';

    // Get profile image path if uploaded
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    // Find this line in updateDriver:
    if (req.file) {
      if (driver.profileImage) {
        const oldImagePath = `.${driver.profileImage}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      driver.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // Create driver
    const driver = await User.create({
      firstName,
      surname,
      email,
      phoneNumber,
      licenseNumber,
      municipality,
      vehicleRegistration,
      validUntil,
      password: tempPassword,
      role: "driver",
      profileImage,
      isActive: true,
    });

    // Remove password from response
    const driverResponse = driver.toObject();
    // delete driverResponse.password;

    res.status(201).json({
      success: true,
      message: "Driver created successfully.",
      data: driverResponse,
    //   tempPassword: tempPassword,
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
    const {firstName,surname,email,phoneNumber,licenseNumber,municipality,vehicleRegistration,validUntil} = req.body;
    const driver = await User.findOne({_id: req.params.id,role: "driver",});
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== driver.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Check if license number is being changed and already exists
    if (licenseNumber && licenseNumber !== driver.licenseNumber) {
      const existingLicense = await User.findOne({ licenseNumber });
      if (existingLicense) {
        return res.status(400).json({
          success: false,
          message: "License number already exists",
        });
      }
    }

    // Validate validUntil if being updated
    if (validUntil && new Date(validUntil) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Valid Until date must be in the future",
      });
    }

    // Update fields
    if (firstName) driver.firstName = firstName;
    if (surname) driver.surname = surname;
    if (email) driver.email = email;
    if (phoneNumber) driver.phoneNumber = phoneNumber;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (municipality) driver.municipality = municipality;
    if (vehicleRegistration !== undefined) driver.vehicleRegistration = vehicleRegistration;
    if (validUntil) driver.validUntil = validUntil;

    // Update profile image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (driver.profileImage) {
        const oldImagePath = `.${driver.profileImage}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      driver.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await driver.save();
    // Remove password from response
    const driverResponse = driver.toObject();
    delete driverResponse.password;

    res.json({
      success: true,
      message: "Driver updated successfully",
      data: driverResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete driver
// @route   DELETE /api/superAdmin/drivers/:id
// @access  Super Admin
export const deleteDriver = async (req, res) => {
  try {
    const driver = await User.findOne({_id: req.params.id,role: "driver",});
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Delete profile image if exists
    if (driver.profileImage) {
      const imagePath = `.${driver.profileImage}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
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
import DriverResume from "../../models/driverResume.model.js";
import { driverResumeSchema } from "../../validation/driverResume.validation.js";
import User from "../../models/user.model.js";

export const upsertResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const file = req.file;

    // Basic validation
    if (!data.fullName || !data.email)
      return res.status(400).json({ success: false, message: "Full name and email are required." });

    if (!data.licenseNumber)
      return res.status(400).json({ success: false, message: "License number is required." });

    // Get user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Handle license number consistency
    if (user.licenseNumber && user.licenseNumber !== data.licenseNumber) {
      if (user.isLicenseVerified) {
        return res.status(400).json({
          success: false,
          message: "You cannot change license number once verified. Please contact admin.",
        });
      } else {
        user.licenseNumber = data.licenseNumber;
        await user.save();
      }
    }

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const existingResume = await DriverResume.findOne({ userId });
    
    // Construct resume object
    const resumeData = {
      userId,
      basicInfo: {
        fullName: data.fullName,
        email: data.email,
        municipality: data.municipality,
        dob: data.dob || null,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry || null,
        licensePhoto: file ? `${baseURL}/uploads/profiles/${file.filename}` : existingResume?.basicInfo?.licensePhoto || null,
      },
      experience: {
        companyName: data.companyName,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        routeType: data.routeType ? data.routeType.split(",") : [],
        vehicleType: data.vehicleType ? data.vehicleType.split(",") : [],
        description: data.description,
      },
      skillPreferences: {
        skills: data.skills ? data.skills.split(",") : [],
        additionalPreferences: data.additionalPreferences,
      },
    };

    // Upsert logic (create or update)
    const resume = await DriverResume.findOneAndUpdate(
      { userId },
      { $set: resumeData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Resume saved successfully.",
      data: resume,
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving resume.",
    });
  }
};


export const getResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resume = await DriverResume.findOne({ userId });

    if (!resume) {
      return res.status(200).json({
        success: true,
        data: {
          basicInfo: {},
          experience: {},
          skillPreferences: {},
        },
      });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


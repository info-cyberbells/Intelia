import fs from 'fs';
import path from 'path';
import User from "../models/user.model.js";
import { validateUpdateProfile } from "../validation/profile.validation.js";

/**
 * Get : Method
 * Common Function
 * Get Profile data of users
 */
export const getProfile = async (req, res) => {
  try {
    const authUser = req.user;
    const user = await User.findById(authUser.id).select("-password -social_token");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Single role (string)
    const role = user.role?.toLowerCase();
    let roleData = {};

    // Role-specific data handling
    switch (role) {
      case "driver":
        roleData = {
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "owner":
        roleData = {
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "superAdmin":
        roleData = {
          message: "Super admin access granted",
        };
        break;

      default:
        roleData = {
          message: "Standard user profile",
        };
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...roleData,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/**
 * PUT : Method
 * Common Function
 * Update Profile data of users
 */
export const updateProfile = async (req, res) => {
  try {
    const authUser = req.user;
    const user = await User.findById(authUser.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const role = user.role?.toLowerCase();
    const data = req.body;
    const { error } = validateUpdateProfile(data, role);
    if (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: error.details ? error.details[0].message : error.message,
      });
    }

    // --- Update logic per role ---
    switch (role) {
      case "driver":
        if (data.firstName) user.firstName = data.firstName;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        break;

      case "owner":
        if (data.firstName) user.firstName = data.firstName;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        break;

      case "superadmin":
        if (data.firstName) user.firstName = data.firstName;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        break;

      default:
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this profile.",
        });
    }

    if (req.file) {
      // Delete Old
      if (user.avatar) {
        try {
          const oldPath = path.join(process.cwd(), user.avatar);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn('Error deleting old avatar', err);
        }
      }
      // Save
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
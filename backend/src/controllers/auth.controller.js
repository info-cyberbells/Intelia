import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Register Driver
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber, licenseNumber, municipality, validUntil } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Driver already exists" });

    // Prevent role escalation
    if (role === "owner" || role === "superAdmin") {
      return res.status(403).json({ message: "You cannot assign this role manually" });
    }

    // let profileImage = null;
    // if (req.file) {
    //   profileImage = `/uploads/profiles/${req.file.filename}`;
    // }

    const profileImage = req.files?.profileImage ? `/uploads/profiles/${req.files.profileImage[0].filename}`: null;
    const licensePhoto = req.files?.licensePhoto ? `/uploads/profiles/${req.files.licensePhoto[0].filename}` : null;


    // Create user with all fields
    const user = await User.create({
      fullName,
      email,
      password,
      role: "driver",
      phoneNumber,
      licenseNumber,
      municipality,
      validUntil,
      profileImage,
      licensePhoto,
      isActive: false, // Default inactive until approval
      status: "pending"
    });

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const userData = user.toObject();
    if (userData.profileImage && !userData.profileImage.startsWith("http")) {
      userData.profileImage = `${baseURL}${userData.profileImage}`;
    }

    if (userData.licensePhoto && !userData.licensePhoto.startsWith("http")) {
      userData.licensePhoto = `${baseURL}${userData.licensePhoto}`;
    }

    res.status(201).json({ message: "Driver registered successfully", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "driver" && !user.isActive) {
      return res.status(403).json({
        message: "Your account is pending approval. Please wait for admin verification."
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge,
    });

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const userData = user.toObject();

    if (userData.profileImage) {
      if (!userData.profileImage.startsWith("http")) {
        userData.profileImage = `${baseURL}${userData.profileImage}`;
      }
    }

    if (userData.avatar) {
      if (!userData.avatar.startsWith("http")) {
        userData.profileImage = `${baseURL}${userData.avatar}`;
        userData.avatar = `${baseURL}${userData.avatar}`;
      }
    }

    res.json({ message: "Login successful", token, user:userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Only Super Admin can create Admin users
export const createCarOwner = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, companyName, correspondedMe } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const admin = await User.create({ fullName, email, password, phoneNumber, companyName, correspondedMe, role: "owner", isActive: true, status: "approved" });
    res.status(201).json({ message: "Owner created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = req.user;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Decode token to get expiry
    const decoded = jwt.decode(token);

    // Add token to blacklist
    await TokenBlacklist.create({
      token: token,
      userId: user._id,
      expiresAt: new Date(decoded.exp * 1000),
    });

    console.log(`User logged out: ${user.email} (${user.role})`);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    console.log("SENDGRID KEY:", process.env.SENDGRID_API_KEY);
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "Email not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 minutes

    await user.save();

    // Reset link
    const resetLink = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

    // Send Email
    const msg = {
      to: user.email,
      from: "info.cyberbells@gmail.com",
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    };

    await sgMail.send(msg);

    return res.json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });

    user.password = password; // hashing will happen in model pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Register
export const register = async (req, res) => {
  try {
    const { firstName, surname, email, password, role, phoneNumber, licenseNumber, municipality, vehicleRegistration, validUntil } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Driver already exists" });

    // Prevent role escalation
    if (role === "owner" || role === "superAdmin") {
      return res.status(403).json({ message: "You cannot assign this role manually" });
    }

    // Create user with all fields
    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      role: "driver",
      phoneNumber,
      licenseNumber,
      municipality,
      vehicleRegistration,
      validUntil
    });

    res.status(201).json({ message: "Driver registered successfully", user });
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Only Super Admin can create Admin users
export const createCarOwner = async (req, res) => {
  console.log('HELLO');
  try {
    const { firstName, surname, companyName, correspondedMe, email, password, phoneNumber } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const admin = await User.create({ firstName, surname, companyName, correspondedMe, email, password, phoneNumber, role: "owner" });
    res.status(201).json({ message: "Owner created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

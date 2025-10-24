import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Protect all routes with superAdmin role
router.use(authenticate, authorizeRoles("superAdmin"));

// Super Admin Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Add more super admin specific routes here
// For example: view all users, manage system settings, etc.

export default router;
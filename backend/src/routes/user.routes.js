import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Common profile route for all authenticated users
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// Only Car Owner & Super Admin
router.get("/owner-dashboard", authenticate, authorizeRoles("owner", "superAdmin"), (req, res) => {
  res.json({ message: "Owner Dashboard Access Granted" });
});

// Only Super Admin
router.get("/super-admin-panel", authenticate, authorizeRoles("superAdmin"), (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Only driver
router.get("/driver-dashboard", authenticate, authorizeRoles("driver"), (req, res) => {
  res.json({ message: "Driver Dashboard Access Granted" });
});

export default router;

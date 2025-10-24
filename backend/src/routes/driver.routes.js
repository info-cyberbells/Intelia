import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Protect all routes with driver role
router.use(authenticate, authorizeRoles("driver"));

// Driver Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Driver Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Add driver-specific routes here
// For example: view assigned trips, update availability, etc.

export default router;
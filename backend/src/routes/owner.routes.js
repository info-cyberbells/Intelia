import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Protect all routes with owner role
router.use(authenticate, authorizeRoles("owner"));

// Owner Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Owner Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Add owner-specific routes here
// For example: manage vehicles, view drivers, etc.

export default router;
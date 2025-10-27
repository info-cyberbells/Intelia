import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import upload from '../middleware/upload.js';
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
router.put("/profile", upload.single('avatar'), updateProfile);

export default router;
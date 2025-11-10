import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword, deleteProfileImage } from "../controllers/profile.controller.js";
import { validateChangePassword } from "../validation/profile.validation.js";
import upload from "../middleware/upload.middleware.js";
import { applyJob, withdrawApplication, listAvailableJobs, saveJob } from "../controllers/driver/jobApplication.controller.js";

const router = express.Router();

// Protect all routes with driver role
router.use(authenticate, authorizeRoles("driver"));

// Driver Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ 
    success: true,
    message: "Driver Dashboard Access Granted",
    user: req.user 
  });
});

// Profile
// router.get("/profile", getProfile);
// router.put("/profile", updateProfile);
router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile); // Support 'avatar' field name
router.delete("/profile-image", deleteProfileImage);
router.put("/change-password", validateChangePassword, changePassword);

// Jobs
router.get("/jobs", listAvailableJobs);
router.post("/job/save-job", saveJob);

// Job Application
router.post("/job/apply/:jobId", applyJob);
router.put("/job/withdraw/:jobId", withdrawApplication);

export default router;
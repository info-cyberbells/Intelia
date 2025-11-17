import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword, deleteProfileImage } from "../controllers/profile.controller.js";
import { validateChangePassword } from "../validation/profile.validation.js";
import upload from "../middleware/upload.middleware.js";
import { applyJob, withdrawApplication, listAvailableJobs, saveJob, getDriverApplications } from "../controllers/driver/jobApplication.controller.js";
import { updateSettings, getSettings } from "../controllers/driver/settings.controller.js";
import { submitFeedback } from "../controllers/driver/feedback.controller.js";
import { getSystemNotifications } from "../controllers/systemNotificationController.js";
import { upsertResume, getResume } from "../controllers/driver/driverResume.controller.js";
import { getClientReviews } from "../controllers/review.controller.js";
import { getJobById } from "../controllers/owner/job.controller.js";

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
router.get("/job/:jobId", getJobById);

// Job Application
router.post("/job/apply/:jobId", applyJob);
router.put("/job/withdraw/:jobId", withdrawApplication);
router.get("/my-applications", getDriverApplications);

//Settings
router.get("/settings", getSettings);
router.post("/update-settings", updateSettings);

// Psot Feedback
router.post("/post-feedback", submitFeedback);

//Notifications
router.get("/my-notifications", getSystemNotifications);

// Resume
router.get("/my-resume", getResume);
router.post("/post-resume", upload.single("licensePhoto"), upsertResume);

// Reviews
router.get("/driver-reviews", getClientReviews);

export default router;
import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword, deleteProfileImage } from "../controllers/profile.controller.js";
import { validateChangePassword } from "../validation/profile.validation.js";
import upload from "../middleware/upload.middleware.js";
import { createVehicle, getMyVehicles, updateVehicle, deleteVehicle } from "../controllers/owner/vehicleController.js";
import { getMyNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { validateCreateVehicle, validateUpdateVehicle } from "../validation/vehicle.validation.js";
import { createJob, updateJob, deleteJob, listJobs, getJobById, manageApplications, getJobApplications, getApplicationSummary, shortlistApplicant, getShortlistedApplicants } from "../controllers/owner/job.controller.js";
import { getOwnerDashboard } from "../controllers/owner/dashboard.controller.js";
import { getMyDrivers ,getMyDriverProfile, searchDriverByLicense } from "../controllers/owner/ownerDriverController.js";
import { addReview, getClientReviews } from "../controllers/review.controller.js";

const router = express.Router();

// Protect all routes with owner role
router.use(authenticate, authorizeRoles("owner"));

// Owner Dashboard
router.get("/dashboard", getOwnerDashboard);

// Profile
// router.get("/profile", getProfile);
// router.put("/profile", updateProfile);
router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile); // Support 'avatar' field name
router.delete("/profile-image", deleteProfileImage);
router.put("/change-password", validateChangePassword, changePassword);

// Vehicle
router.post("/vehicle", async (req, res) => {
  const { error } = validateCreateVehicle(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }

  return createVehicle(req, res);
});
router.get("/vehicles", getMyVehicles);
router.put("/vehicle/:vehicleId", async (req, res) => {
  const { error } = validateUpdateVehicle(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }

  return updateVehicle(req, res);
});
router.delete("/vehicle/:vehicleId", deleteVehicle);

// Notification
router.get("/", getMyNotifications);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read/all", markAllAsRead);

router.get("/jobs", listJobs);
router.post("/job", createJob);
router.put("/job/:jobId", updateJob);
router.get("/job/:jobId", getJobById);
router.delete("/job/:jobId", deleteJob);
router.put("/:jobId/applicants/:driverId", manageApplications);

router.get("/jobs/:jobId/applications", getJobApplications);
router.get("/jobs/:jobId/summary", getApplicationSummary);
router.put("/job/:jobId/applicants/:driverId/shortlist", shortlistApplicant);
router.get("/jobs/:jobId/shortlisted", getShortlistedApplicants);

// Driver listing
router.get("/drivers", getMyDrivers);
router.get("/driver/profile/:driverId", getMyDriverProfile);
router.get("/driver/search", searchDriverByLicense);

// Reviews
router.post("/driver-reviews", addReview);
router.get("/driver-reviews/:clientId", getClientReviews);

export default router;
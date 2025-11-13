import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDrivers, toggleDriverStatus, getDriverStats, getMunicipalities } from "../controllers/driver.controller.js";
import { validateCreateDriver, validateUpdateDriver } from "../validation/driver.validation.js";
import { verifyVehicle, updateDriverStatus } from "../controllers/superAdmin/moderation.controller.js";
import { getAllClients, getClientById, createClient, updateClient, deleteClient, toggleClientStatus, getClientStats } from "../controllers/client.controller.js";
import { validateCreateClient, validateUpdateClient } from "../validation/client.validation.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { getAllFeedbacks } from "../controllers/driver/feedback.controller.js";
import { uploadProfile, uploadLicensePhoto } from "../middleware/upload.middleware.js";
import { getClientReviews } from "../controllers/review.controller.js";

const router = express.Router();

// Protect all routes with superAdmin role
router.use(authenticate, authorizeRoles("superAdmin"));

// Super Admin Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// =================== Profile ===================
router.get("/profile", getProfile);
router.put("/profile", uploadProfile.single("avatar"), updateProfile);

// =================== Client Routes ===================
router.get("/clients/stats", getClientStats);
router.get("/clients", getAllClients);
router.get("/clients/:id", getClientById);
router.post("/clients", uploadProfile.single("profileImage"), validateCreateClient, createClient);
router.put("/clients/:id", uploadProfile.single("profileImage"), validateUpdateClient, updateClient);
router.delete("/clients/:id", deleteClient);
router.patch("/clients/:id/toggle-status", toggleClientStatus);

// =================== Driver Routes ===================
router.get("/drivers/stats", getDriverStats);
router.get("/drivers/municipalities", getMunicipalities);
router.get("/drivers", getAllDrivers);
router.get("/drivers/:id", getDriverById);

// Handle both profile and license image in single API
router.post(
  "/drivers",
  uploadProfile.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "licensePhoto", maxCount: 1 },
  ]),
  validateCreateDriver,
  createDriver
);

router.put(
  "/drivers/:id",
  uploadProfile.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "licensePhoto", maxCount: 1 },
  ]),
  validateUpdateDriver,
  updateDriver
);

router.delete("/drivers/delete", deleteDrivers);
router.patch("/drivers/:id/toggle-status", toggleDriverStatus);
router.patch("/drivers/status/:id", updateDriverStatus);

// Vehicle Verification
router.patch("/vehicle/verify/:vehicleId", verifyVehicle);

// Feedback
router.get("/feedbacks", getAllFeedbacks);

// Reviews
router.get("/driver-reviews/:clientId", getClientReviews);

export default router;

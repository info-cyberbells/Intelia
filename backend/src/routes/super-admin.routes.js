import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import {getAllClients,getClientById,createClient,updateClient,deleteClient,toggleClientStatus,getClientStats } from "../controllers/client.controller.js";
import { getAllDrivers,getDriverById,createDriver,updateDriver,deleteDriver,toggleDriverStatus,getDriverStats,getMunicipalities } from "../controllers/driver.controller.js";
import { validateCreateClient, validateUpdateClient } from "../validation/client.validation.js";
import { validateCreateDriver, validateUpdateDriver } from "../validation/driver.validation.js";
import upload from "../middleware/upload.middleware.js";
import { verifyVehicle } from "../controllers/superAdmin/moderation.controller.js";

const router = express.Router();

// Protect all routes with superAdmin role
router.use(authenticate, authorizeRoles("superAdmin"));

// Super Admin Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Profile
router.get("/profile", getProfile);
// router.put("/profile", upload.single('avatar'), updateProfile);

// Client
router.get("/clients/stats", getClientStats);
router.get("/clients", getAllClients);
router.get("/clients/:id", getClientById);
router.post("/clients", upload.single("profileImage"), validateCreateClient, createClient);
router.put("/clients/:id", upload.single("profileImage"), validateUpdateClient, updateClient);
router.delete("/clients/:id", deleteClient);
router.patch("/clients/:id/toggle-status", toggleClientStatus);

// Driver
router.get("/drivers/stats", getDriverStats);
router.get("/drivers/municipalities", getMunicipalities);
router.get("/drivers", getAllDrivers);
router.get("/drivers/:id", getDriverById);
router.post("/drivers", upload.single("profileImage"), validateCreateDriver, createDriver);
router.put("/drivers/:id", upload.single("profileImage"), validateUpdateDriver, updateDriver);
router.delete("/drivers/:id", deleteDriver);
router.patch("/drivers/:id/toggle-status", toggleDriverStatus);

router.patch("/vehicle/verify/:vehicleId", verifyVehicle);

export default router;
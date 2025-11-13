import express from "express";
import { getRouteTypes, getVehicleTypes, getDriverSkills } from "../controllers/master.controller.js";

const router = express.Router();

router.get("/route-types", getRouteTypes);
router.get("/vehicle-types", getVehicleTypes);
router.get("/skills", getDriverSkills);

export default router;

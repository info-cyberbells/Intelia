import RouteType from "../models/routeType.model.js";
import VehicleType from "../models/vehicleType.model.js";
import DriverSkill from "../models/driverSkill.model.js";

// =======================
// ROUTE TYPES
// =======================
export const getRouteTypes = async (req, res) => {
  try {
    const data = await RouteType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch route types" });
  }
};

// =======================
// VEHICLE TYPES
// =======================
export const getVehicleTypes = async (req, res) => {
  try {
    const data = await VehicleType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicle types" });
  }
};

// =======================
// DRIVER SKILLS
// =======================
export const getDriverSkills = async (req, res) => {
  try {
    const data = await DriverSkill.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch driver skills" });
  }
};

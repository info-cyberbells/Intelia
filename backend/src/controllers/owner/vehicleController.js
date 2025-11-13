import Vehicle from "../../models/vehicle.model.js";
import { createNotification } from "../../utils/createSystemNotification.js";
import path from "path";
import fs from "fs";

/**
 * Create a new vehicle
 */
export const createVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    if (authUser.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can add vehicles.",
      });
    }

    const { make, model, year, color, vin, plateNo, registrationState, capacity, fuelType, transmission, registrationExpiry, lastInspection, insurance } = req.body;
    const existing = await Vehicle.findOne({ ownerId: authUser.id, plateNo });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this plate already exists.",
      });
    }

    // Uploaded image
    let vehicleImagePath = null;
    if (req.file) {
      vehicleImagePath = `/uploads/vehicles/${req.file.filename}`;
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      ownerId: authUser.id,
      make,
      model,
      year,
      color,
      vin,
      plateNo,
      registrationState,
      capacity,
      fuelType,
      transmission,
      registrationExpiry,
      lastInspection,
      insurance,
      vehicleImage: vehicleImagePath,
    });

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const responseVehicle = vehicle.toObject();
    if (responseVehicle.vehicleImage) {
      responseVehicle.vehicleImage = `${baseURL}${responseVehicle.vehicleImage}`;
    }

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: responseVehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all vehicles
 */
export const getMyVehicles = async (req, res) => {
  try {
    const authUser = req.user;

    if (authUser.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can view their vehicles.",
      });
    }

    const vehicles = await Vehicle.find({ ownerId: authUser.id }).sort({ createdAt: -1 });

    const baseURL = `${req.protocol}://${req.get("host")}`;
    const updatedVehicles = vehicles.map((vehicle) => {
      const v = vehicle.toObject();
      if (v.vehicleImage) {
        v.vehicleImage = `${baseURL}${v.vehicleImage}`;
      }
      return v;
    });

    res.json({
      success: true,
      data: updatedVehicles,
    });
  } catch (error) {
    console.error("List vehicles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update vehicle by ID
 */
export const updateVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: authUser.id });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or not yours.",
      });
    }

    // Clean form-data body
    const cleanedBody = {};
    for (const key in req.body) {
      if (key.startsWith("insurance[")) {
        const match = key.match(/insurance\[(.+)\]/);
        if (match) {
          cleanedBody.insurance = cleanedBody.insurance || {};
          cleanedBody.insurance[match[1]] = req.body[key];
        }
      } else {
        cleanedBody[key] = req.body[key];
      }
    }

    // Handle uploaded file (if any)
    if (req.file) {
      // delete old image if exists
      if (vehicle.vehicleImage && fs.existsSync(`.${vehicle.vehicleImage}`)) {
        fs.unlinkSync(`.${vehicle.vehicleImage}`);
      }

      // set new image path
      cleanedBody.vehicleImage = `/uploads/vehicles/${req.file.filename}`;
    }

    // Merge updates
    Object.assign(vehicle, cleanedBody, { updatedAt: new Date() });
    await vehicle.save();

    const baseURL = `${req.protocol}://${req.get("host")}`;
    if (vehicle.vehicleImage) {
      vehicle.vehicleImage = `${baseURL}${vehicle.vehicleImage}`;
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, ownerId: authUser.id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not yours." });
    }

    res.json({ success: true, message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Verify vehicle
 */
export const verifyVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    if (authUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access only." });
    }

    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    vehicle.isVerified = true;
    vehicle.status = "available";
    await vehicle.save();


    await createNotification({
      userId: vehicle.ownerId, // driver who owns the vehicle
      title: req.body.verified ? "Vehicle Verified" : "Vehicle Rejected",
      message: req.body.verified
        ? "Your vehicle has been successfully verified by the admin."
        : `Your vehicle was rejected. Remarks: ${req.body.remarks || "No remarks"}`,
      type: "vehicle",
      relatedId: vehicle._id,
      onModel: "Vehicle",
    });

    res.json({ success: true, message: "Vehicle verified successfully.", data: vehicle });
  } catch (error) {
    console.error("Verify vehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

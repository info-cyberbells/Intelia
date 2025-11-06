import Vehicle from "../../models/vehicle.model.js";

/**
 * Create a new vehicle
 */
export const createVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    if (authUser.role !== "owner") {
      return res.status(403).json({ success: false, message: "Only owners can add vehicles." });
    }

    const { make, model, year, color, vin, plateNo, registrationState, capacity, fuelType, transmission, registrationExpiry, lastInspection, insurance } = req.body;

    // Prevent duplicate plateNo for same owner
    const existing = await Vehicle.findOne({ ownerId: authUser.id, plateNo });
    if (existing) {
      return res.status(400).json({ success: false, message: "Vehicle with this plate already exists." });
    }

    const vehicle = await Vehicle.create({ ownerId: authUser.id, make, model, year, color, vin, plateNo, registrationState, capacity, fuelType, transmission, registrationExpiry, lastInspection, insurance, });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all vehicles
 */
export const getMyVehicles = async (req, res) => {
  try {
    const authUser = req.user;

    if (authUser.role !== "owner") {
      return res.status(403).json({ success: false, message: "Only owners can view their vehicles." });
    }

    const vehicles = await Vehicle.find({ ownerId: authUser.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error("List vehicles error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
      return res.status(404).json({ success: false, message: "Vehicle not found or not yours." });
    }

    Object.assign(vehicle, req.body, { updatedAt: new Date() });
    await vehicle.save();

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

    res.json({ success: true, message: "Vehicle verified successfully.", data: vehicle });
  } catch (error) {
    console.error("Verify vehicle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

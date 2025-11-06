import Vehicle from "../../models/vehicle.model.js";

// Verify a vehicle
export const verifyVehicle = async (req, res) => {
  try {
    const authUser = req.user;
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    vehicle.isVerified = req.body.verified;
    vehicle.remarks = req.body.remarks;  // remarks by admin
    vehicle.verifiedBy = authUser.id;
    vehicle.verifiedAt = new Date();

    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: `Vehicle ${req.body.verified ? "verified" : "unverified"} successfully.`,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error verifying vehicle:", error);
    return res.status(500).json({
      success: false,
      message: "Server error verifying vehicle",
    });
  }
};

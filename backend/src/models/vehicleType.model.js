import mongoose from "mongoose";

const vehicleTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    example: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("VehicleType", vehicleTypeSchema);

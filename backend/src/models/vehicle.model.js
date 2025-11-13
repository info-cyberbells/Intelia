import { text } from "express";
import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },

  // Basic info
  make: { type: String, required: true, trim: true },      // e.g., Toyota
  model: { type: String, required: true, trim: true },     // e.g., Camry
  year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() + 1 },
  color: { type: String, trim: true },

  // Identification
  vin: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true, 
    uppercase: true, 
    minlength: 11, 
    maxlength: 17 
  }, // Optional but globally recognized
  plateNo: { 
    type: String, 
    required: true, 
    trim: true, 
    uppercase: true, 
    index: true 
  },
  registrationState: { 
    type: String, 
    trim: true 
  }, // e.g., "CA" (USA), "WA" (Australia)

  // Operational details
  capacity: { type: Number, default: 4 }, // seating capacity
  fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], default: "petrol" },
  transmission: { type: String, enum: ["manual", "automatic"], default: "automatic" },

  // Compliance & inspection
  registrationExpiry: { type: Date }, // official reg expiry date
  lastInspection: { type: Date },     // last mechanical inspection date
  insurance: {
    provider: String,
    policyNo: String,
    expiryDate: Date
  },

  // Status & usage
  isActive: { type: Boolean, default: true }, // can be used for jobs
  isVerified: { type: Boolean, default: false }, // admin
  status: { 
    type: String, 
    enum: ["available", "assigned", "inactive", "maintenance"], 
    default: "available" 
  },

  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: { type: Date },
  remarks: { type: String }, // admin remarks
  vehicleImage: {
    type: String, // URL or file path
    default: null
  },
  // Audit
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Keep updatedAt in sync automatically
VehicleSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

// Prevent duplicate plate numbers per owner
VehicleSchema.index({ ownerId: 1, plateNo: 1 }, { unique: true });

export default mongoose.model("Vehicle", VehicleSchema);

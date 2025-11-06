import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: false, // optional — some jobs may be generic
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, default: "Australia" }, // or USA based on project region
    },

    vacancy: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    applicants: [
      {
        driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["applied", "accepted", "rejected", "withdrawn"],
          default: "applied",
        },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["open", "closed", "expired"],
      default: "open",
    },

    isExpired: {
      type: Boolean,
      default: false,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);

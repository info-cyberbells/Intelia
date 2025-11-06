import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // denormalized owner
  status: { type: String, enum: ["applied","shortlisted","rejected","accepted","withdrawn"], default: "applied", index: true },
  appliedAt: { type: Date, default: Date.now },
  coverNote: { type: String },
  attachments: [{ url: String, name: String }],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// prevent duplicate apply
ApplicationSchema.index({ jobId: 1, driverId: 1 }, { unique: true });

export default mongoose.model('Application', ApplicationSchema);

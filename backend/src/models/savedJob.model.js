import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saved jobs
savedJobSchema.index({ driverId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);
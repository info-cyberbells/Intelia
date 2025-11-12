import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["driver", "owner", "superAdmin"], required: true },
    category: { type: String, enum: ["feedback", "issue", "suggestion", "experience", "other"], default: "feedback" },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);

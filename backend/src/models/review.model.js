import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reviewer
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // receiver
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);

import mongoose from "mongoose";

const userSettingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    emailNotification: { type: Boolean, default: true },
    inAppNotification: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("UserSetting", userSettingSchema);

import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  basicInfo: {
    fullName: String,
    email: String,
    municipality: String,
    dob: Date,
    licenseNumber: String,
    licenseExpiry: Date,
    licensePhoto: String,
  },

  experience: {
    companyName: String,
    startDate: Date,
    endDate: Date,
    routeType: [String],
    vehicleType: [String],
    description: String,
  },

  skillPreferences: {
    skills: [String],
    additionalPreferences: String,
  },
}, { timestamps: true });

export default mongoose.model("DriverResume", resumeSchema);

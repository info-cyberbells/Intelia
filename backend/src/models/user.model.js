import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    companyName: { 
      type: String, 
      required: function () {
        return this.role === "owner";
      }, 
      trim: true 
    },
    correspondedMe: { 
      type: String, 
      required: function () {
        return this.role === "owner";
      }, 
      trim: true 
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // basic email format validation
        },
        message: "Please enter a valid email address",
      },
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["superAdmin", "owner", "driver"],
      default: "driver",
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (this.role === "driver") {
            return /^\+?[1-9]\d{1,14}$/.test(value);
          }
          return true;
        },
        message: "Invalid phone number format",
      },
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          // Pattern: 2–3 letters followed by 6–8 digits
          return /^[A-Z0-9-]{5,20}$/i.test(value);
        },
        message: "Invalid license number format",
      },
    },
    municipality: { 
      type: String, 
      required: function () {
        return this.role === "driver";
      }, 
      trim: true 
    },
    vehicleRegistration: { 
      type: String, 
      required: function () {
        return this.role === "driver";
      }, 
      trim: true 
    },
    validUntil: { 
      type: Date,
      required: function () {
        return this.role === "driver";
      },
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "valid Until must be a future date.",
      },
    },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (plainPwd) {
  return await bcrypt.compare(plainPwd, this.password);
};

export default mongoose.model("User", userSchema);

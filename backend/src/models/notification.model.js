// file: models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },

  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }, // optional, e.g., admin or system

  // Notification category
  type: { 
    type: String, 
    enum: ["system", "job", "application", "vehicle", "account"], 
    default: "system" 
  },

  // Core content
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },

  // For linking to other data (optional)
  relatedJobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  relatedVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },

  // Status
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },

  // Optional delivery tracking
  sentByEmail: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  readAt: { type: Date },

  // Auto-expiration (optional)
  expiresAt: { type: Date, index: true },

  createdAt: { type: Date, default: Date.now }
});

// Optional: automatically expire old notifications after 90 days
NotificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 } // Mongo will auto-delete when expiresAt < now
);

export default mongoose.model("Notification", NotificationSchema);

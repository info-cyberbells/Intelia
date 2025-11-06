import Notification from "../models/notification.model.js";

/**
 * Create notification (admin/system/internal use)
 * Can be called from any event or cron job
 */
export const createNotification = async (req, res) => {
  try {
    const authUser = req.user;
    const {
      recipientId,
      title,
      message,
      type,
      relatedJobId,
      relatedVehicleId,
      relatedApplicationId,
    } = req.body;

    if (!recipientId || !title || !message) {
      return res.status(400).json({ success: false, message: "recipientId, title, and message are required." });
    }

    const notification = await Notification.create({
      recipientId,
      senderId: authUser?._id,
      title,
      message,
      type,
      relatedJobId,
      relatedVehicleId,
      relatedApplicationId,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days default
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * List my notifications
 */
export const getMyNotifications = async (req, res) => {
  try {
    const authUser = req.user;
    const { unread } = req.query; // ?unread=true to filter unread

    const filter = { recipientId: authUser._id };
    if (unread === "true") filter.isRead = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("List notifications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Mark one notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const authUser = req.user;
    const { notificationId } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: authUser._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.json({ success: true, data: notif });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const authUser = req.user;
    await Notification.updateMany(
      { recipientId: authUser._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

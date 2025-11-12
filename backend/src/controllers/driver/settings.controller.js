import UserSetting from "../../models/userSetting.model.js";

// Create or update settings
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id; // auth user
    const { emailNotification, inAppNotification, darkMode } = req.body;

    const settings = await UserSetting.findOneAndUpdate(
      { userId },
      { $set: { emailNotification, inAppNotification, darkMode } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

// Fetch settings for current user
export const getSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const settings = await UserSetting.findOne({ userId });

    if (!settings) {
      return res.status(404).json({ success: true, settings: [], message: "No settings found for this user" });
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching settings" });
  }
};

import Feedback from "../../models/userFeedback.model.js";

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const user = req.user;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const feedback = await Feedback.create({
      userId: user._id,
      role: user.role,
      category : "feedback",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ success: false, message: "Server error submitting feedback" });
  }
};

// (Optional) Get all feedbacks (for Owner/SuperAdmin review)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "firstName surname role email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching feedbacks" });
  }
};

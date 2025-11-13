import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { clientId, rating, comment } = req.body;
    const ownerId = req.user._id;
    console.log('ownerId',ownerId)
    if (!clientId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Client ID and rating are required",
      });
    }

    // check valid client
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // check if already reviewed
    const existingReview = await Review.findOne({ owner: ownerId, client: clientId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this client",
      });
    }

    const review = await Review.create({
      owner: ownerId,
      client: clientId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get reviews of a client + average rating
export const getClientReviews = async (req, res) => {
  try {
    const { clientId } = req.params;
    const baseURL = `${req.protocol}://${req.get("host")}`;
    console.log('clientId',clientId)
    const reviews = await Review.find({ client: clientId }).populate("owner", "fullName profileImage").sort({ createdAt: -1 });

    const avgRating = await Review.aggregate([
      { $match: { client: new mongoose.Types.ObjectId(clientId) } },
      { $group: { _id: "$client", avgRating: { $avg: "$rating" } } },
    ]);

    const average = avgRating[0]?.avgRating?.toFixed(1) || 0;

    const formatted = reviews.map((r) => ({
      reviewerName: r.owner?.fullName || "Unknown",
      reviewerPhoto: r.owner?.profileImage ? `${baseURL}${r.owner.profileImage}` : null,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
    }));

    res.json({
      success: true,
      averageRating: average,
      totalReviews: reviews.length,
      reviews: formatted,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

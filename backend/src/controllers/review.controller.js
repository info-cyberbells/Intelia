import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { driverId, rating, comment } = req.body;
    const ownerId = req.user._id;
    console.log('ownerId',ownerId)
    if (!driverId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Driver ID and rating are required",
      });
    }

    // check valid Driver
    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // check if already reviewed
    const existingReview = await Review.findOne({ owner: ownerId, driver: driverId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this driver",
      });
    }

    const review = await Review.create({
      owner: ownerId,
      driver: driverId,
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
    const { driverId } = req.params;
    const baseURL = `${req.protocol}://${req.get("host")}`;
    // console.log('driverId',driverId)
    const reviews = await Review.find({ driver: driverId }).populate("owner", "fullName profileImage").sort({ createdAt: -1 });

    const avgRating = await Review.aggregate([
      { $match: { driver: new mongoose.Types.ObjectId(driverId) } },
      { $group: { _id: "$driver", avgRating: { $avg: "$rating" } } },
    ]);

    const average = avgRating[0]?.avgRating?.toFixed(1) || 0;
    // console.log('reviews',reviews);
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

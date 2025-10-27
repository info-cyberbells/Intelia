import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword, deleteProfileImage } from "../controllers/profile.controller.js";
import { validateChangePassword } from "../validation/profile.validation.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Protect all routes with owner role
router.use(authenticate, authorizeRoles("owner"));

// Owner Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ 
    success: true,
    message: "Owner Dashboard Access Granted",
    user: req.user 
  });
});

// Profile
// router.get("/profile", getProfile);
// router.put("/profile", updateProfile);
router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile); // Support 'avatar' field name
router.delete("/profile-image", deleteProfileImage);
router.put("/change-password", validateChangePassword, changePassword);


export default router;
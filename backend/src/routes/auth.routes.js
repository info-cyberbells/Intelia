import express from "express";
import { register, login, createCarOwner, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateRegister } from "../validation/auth.validation.js";
import { setRole } from "../middleware/setRole.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
// router.post("/register", uploadAvatar.single("profileImage"), validateRegister, register);

router.post(
  "/register",
  uploadAvatar.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "licensePhoto", maxCount: 1 },
  ]),
  validateRegister,
  register
);

router.post("/login", login);

// Logout (All authenticated users)
router.post("/logout", authenticate, logout);


// Protected (Super Admin only) - Create car owner
router.post("/create-owner", setRole("owner"), validateRegister, createCarOwner);

export default router;
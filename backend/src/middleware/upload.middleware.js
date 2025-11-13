import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Base upload directory
const baseUploadDir = path.join(process.cwd(), "uploads");

// Create base directory if it doesn't exist
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// ============================================
// AVATAR UPLOAD (For Profile Images)
// ============================================
const avatarDir = path.join(baseUploadDir, "avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ============================================
// PROFILE UPLOAD (For Super Admin CRUD)
// ============================================
const profileDir = path.join(baseUploadDir, "profiles");
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// ============================================
// COMMON FILE FILTER
// ============================================
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WEBP, GIF) are allowed!"), false);
  }
};

// ============================================
// UPLOAD INSTANCES
// ============================================


// ============================================
// LICENSE PHOTO UPLOAD (for Driver License images)
// ============================================
const licenseDir = path.join(baseUploadDir, "licenses");
if (!fs.existsSync(licenseDir)) {
  fs.mkdirSync(licenseDir, { recursive: true });
}

const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, licenseDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "license-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create the multer instance
export const uploadLicensePhoto = multer({
  storage: licenseStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


// For Owner/Driver profile updates (uses avatars folder)
export const uploadAvatar = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// For Super Admin CRUD operations (uses profiles folder)
export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Default export (for backward compatibility)
export default uploadAvatar;
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    updateProfile,
    forgotPassword,
    resetPassword,
    getUserProfile,
} = require("../controllers/user_controller");

const protect = require("../middleware/auth_middleware");
const upload = require("../middleware/imageUpload_middleware");

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE
router.get("/getUserData", protect, getUserProfile);

// ✅ update profile with image
router.put(
    "/update-profile",
    protect,
    upload.single("profileImage"),
    updateProfile
);

// PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
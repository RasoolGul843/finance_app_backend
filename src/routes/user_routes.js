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

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE
router.put("/update-profile", protect, updateProfile);
router.get("/getUserData", protect, getUserProfile);

// PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-profile", protect, updateProfile);
router.get("/getUserData", protect, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
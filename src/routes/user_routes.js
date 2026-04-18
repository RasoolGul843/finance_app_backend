const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/user_controller");

// Debug route
router.get("/register", (req, res) => {
    res.send("Register route working (GET)");
});

// Actual routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
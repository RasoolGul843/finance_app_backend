const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/send_email");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        res.status(201).json({ message: "Registered successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:3000/api/users/reset-password/${resetToken}`;

        console.log("RESET URL:", resetUrl);

        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            message: resetUrl,
        });

        res.json({ message: "Reset link sent" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const token = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.json({ message: "Password reset success" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
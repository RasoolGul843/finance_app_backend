const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

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

        user.password = undefined;

        return res.status(201).json({
            message: "Registered successfully. Please login.",
            user,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        user.password = undefined;

        return res.json({ token, user });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE PROFILE ✅
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // email check
        if (email && email !== user.email) {
            const emailExist = await User.findOne({ email });
            if (emailExist) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        // phone check
        if (phone && phone !== user.phone) {
            const phoneExist = await User.findOne({ phone });
            if (phoneExist) {
                return res.status(400).json({ message: "Phone already in use" });
            }
            user.phone = phone;
        }

        if (name) user.name = name;

        await user.save();

        return res.json({
            message: "Profile updated successfully",
            user,
        });
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// GET CURRENT USER PROFILE ✅
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User fetched successfully",
            user,
        });
    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        return res.json({
            message: "Reset link generated",
            resetUrl: `http://localhost:3000/api/users/reset-password/${resetToken}`,
        });
    } catch (err) {
        console.error("FORGOT ERROR:", err);
        return res.status(500).json({ message: err.message });
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

        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.json({ message: "Password reset success" });
    } catch (err) {
        console.error("RESET ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    forgotPassword,
    resetPassword,
    getUserProfile,
};
const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// REGISTER (SAFE)
const registerUser = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const name = req.body?.name;
        const email = req.body?.email;
        const password = req.body?.password;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
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

        return res.status(201).json({
            message: "Registered successfully",
            user,
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const email = req.body?.email;
        const password = req.body?.password;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET missing" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ token, user });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// FORGOT PASSWORD (SAFE)
const forgotPassword = async (req, res) => {
    try {
        const email = req.body?.email;

        const user = await User.findOne({ email });
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

        return res.json({
            message: "Reset link generated",
            resetUrl: `https://finance-app-eu5v.onrender.com/api/users/reset-password/${resetToken}`,
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

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

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
    forgotPassword,
    resetPassword,
};
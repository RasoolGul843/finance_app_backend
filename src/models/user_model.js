const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 3,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Invalid email"],
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        phone: {
            type: String,
            unique: true,
            sparse: true,
            validate: {
                validator: function (v) {
                    return !v || /^[0-9]{10,15}$/.test(v);
                },
                message: "Invalid phone number",
            },
        },

        profileImage: {
            type: String,
            default: null,
            validate: {
                validator: function (v) {
                    return !v || /^https?:\/\/.+/.test(v);
                },
                message: "Invalid image URL",
            },
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
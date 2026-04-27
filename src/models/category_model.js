const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String, // ✅ URL will be stored here
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
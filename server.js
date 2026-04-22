const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => console.log("DB Error:", err));

// ✅ IMPORT ROUTES (MATCH YOUR FOLDER)
const categoryRoutes = require("./src/routes/category_routes");
const userRoutes = require("./src/routes/user_routes");

// ✅ USE ROUTES
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("API Running...");
});

// ❌ Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
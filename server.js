const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./src/config/db");

connectDB();

const app = express();

// SECURITY + STABILITY MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// LOG ALL REQUESTS (DEBUG)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ROUTES
app.use("/api/users", require("./src/routes/user_routes"));

app.get("/", (req, res) => {
    res.send("API is running...");
});

// GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
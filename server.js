const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => console.log(err));

// routes
const categoryRoutes = require("./src/routes/category_routes");
app.use("/api/categories", categoryRoutes);

// test route
app.get("/", (req, res) => {
    res.send("API Running...");
});

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
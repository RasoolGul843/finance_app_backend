const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// import dns from "node:dns/promises";
// dns.setServers(["8.8.8.8","1.1.1.1"]);

dotenv.config();

const connectDB = require("./src/config/db");

// ✅ Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
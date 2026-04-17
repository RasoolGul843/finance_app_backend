const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./src/config/db");
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", require("./src/routes/user_routes"));

app.get("/", (req, res) => {
    res.send("API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
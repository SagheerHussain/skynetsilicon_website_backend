const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

// Mongo Db Connection
mongoose.connect(`${process.env.MONGO_URL}`);

// Routes
const portfolioRoutes = require("./Routes/portfolioRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");

// Middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (for testing) 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Handle preflight requests
    }

    next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/Images")));

// Routing
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Hello Skynet Server" })
})
app.get("/api/test", (req, res) => {
    res.json({ message: "Hello Skynet Server Shayan" })
})

// Recaptcha
app.post("/verify-recaptcha", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: "No reCAPTCHA token provided!" });
    }

    const secretKey = process.env.RECAPTCHA_KEY; // Ensure this is correctly set in .env

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
        );

        if (response.data.success) {
            res.json({ success: true, message: "reCAPTCHA verified successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Failed reCAPTCHA verification!" });
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        res.status(500).json({ success: false, message: "Error verifying reCAPTCHA" });
    }
});
// Server Listen
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT`, process.env.PORT);
});
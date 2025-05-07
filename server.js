// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const axios = require("axios");
// const path = require("path");

// require("dotenv").config();

// // Mongo Db Connection
// mongoose.connect(`${process.env.MONGO_URL}`);

// // Allowed Origins
// const allowedOrigins = ["http://localhost:5173", "https://skynetsilicon.com"];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: "GET, POST, PUT, DELETE, OPTIONS",
//     allowedHeaders: "Content-Type, Authorization",
// };

// // Apply Middleware
// app.use(cors(corsOptions));
// app.use(express.json()); // Parse JSON (✅ For JSON only)
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data (✅ Optional)
// app.use("/uploads", express.static("uploads"));

// // Routes
// const authRoutes = require("./Routes/authRoutes");
// const portfolioRoutes = require("./Routes/portfolioRoutes");
// const serviceRoutes = require("./Routes/serviceRoutes");
// const categoryRoutes = require("./Routes/categoryRoutes");

// // Routing
// app.use("/api/auth", authRoutes)
// app.use("/api/portfolio", portfolioRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/category", categoryRoutes);

// app.get("/", (req, res) => {
//     res.json({ message: "Hello Skynet Server" })
// })

// // Recaptcha
// app.post("/verify-recaptcha", async (req, res) => {
//     const { token } = req.body;

//     if (!token) {
//         return res.status(400).json({ success: false, message: "No reCAPTCHA token provided!" });
//     }

//     const secretKey = process.env.RECAPTCHA_KEY; // Ensure this is correctly set in .env

//     try {
//         const response = await axios.post(
//             `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
//         );

//         if (response.data.success) {
//             res.json({ success: true, message: "reCAPTCHA verified successfully!" });
//         } else {
//             res.status(400).json({ success: false, message: "Failed reCAPTCHA verification!" });
//         }
//     } catch (error) {
//         console.error("Error verifying reCAPTCHA:", error);
//         res.status(500).json({ success: false, message: "Error verifying reCAPTCHA" });
//     }
// });
// // Server Listen
// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on PORT`, process.env.PORT);
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

// Models (Required before syncing)
const Service = require("./modals/ServiceModal");
const Category = require("./modals/CategoryModal");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 🔥 STEP 1: Sync indexes here
    await Service.syncIndexes();
    await Category.syncIndexes();
    console.log("✅ Indexes synced for Service & Category");

    // 🔥 STEP 2: Start server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// CORS Config
const allowedOrigins = ["http://localhost:5173", "https://skynetsilicon.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/portfolio", require("./Routes/portfolioRoutes"));
app.use("/api/services", require("./Routes/serviceRoutes"));
app.use("/api/category", require("./Routes/categoryRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Hello Skynet Server" });
});

// Recaptcha Route
app.post("/verify-recaptcha", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "No reCAPTCHA token provided!" });

  const secretKey = process.env.RECAPTCHA_KEY;
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
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

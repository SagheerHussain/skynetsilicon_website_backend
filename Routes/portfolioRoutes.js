const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { getPortfolios, getPortfolioById, getPortfolioByCategory, addPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolioController");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "public/Images";
        cb(null, uploadPath); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
});

const upload = multer({ storage });

// Get All Portfolio
router.get("/", getPortfolios);

// Get Portfolio By id
router.get("/id/:id", getPortfolioById);

// Get Portfolio By Category
router.get("/category/:category", getPortfolioByCategory);

// Add Portfolio
router.post("/", upload.single("file"), addPortfolio);

// Update Portfolio
router.put("/update/:id", updatePortfolio);

// Delete Portfolio
router.delete("/delete/:id", deletePortfolio);

module.exports = router;
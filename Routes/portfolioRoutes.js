const express = require("express");
const router = express.Router();
const upload = require('../upload')

const { getPortfolios, getPortfolioById, getPortfolioByCategory, addPortfolio, updatePortfolio, deletePortfolio, deleteManyPortfolio } = require("../controllers/portfolioController");

// Get All Portfolio
router.get("/", getPortfolios);

// Get Portfolio By id
router.get("/id/:id", getPortfolioById);

// Get Portfolio By Category
router.get("/category/:category", getPortfolioByCategory);

// Add Portfolio
router.post("/", upload.single("image"), addPortfolio);

// Update Portfolio
router.put("/update/:id", upload.single("image"), updatePortfolio);

// Delete Portfolio
router.delete("/delete/:id", deletePortfolio);

// Delete Many Services
router.delete("/delete-multiple", deleteManyPortfolio);

module.exports = router;
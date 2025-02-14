const express = require("express");
const router = express.Router();
const { getCategories, getCategoryByName, addCategory } = require("../controllers/categoryController");

// Get All Services
router.get("/", getCategories);

// Get Gategory By Name
router.get("/:name", getCategoryByName)

// Add Service
router.post("/", addCategory);

module.exports = router;
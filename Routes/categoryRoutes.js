const express = require("express");
const router = express.Router();
const { getCategories, getCategoryByName, addCategory, updateCategory, deleteCategory, deleteManyCategories, getSpecificCategories } = require("../controllers/categoryController");

// Get All Services
router.get("/", getCategories);

// Get Gategory By Name
router.get("/get/:id", getCategoryByName)

// Get Specific Categories
router.get("/specific-categories", getSpecificCategories)

// Add Service
router.post("/", addCategory);

// Update Service
router.put("/update/:id", updateCategory);

// Delete Service
router.delete("/delete/:id", deleteCategory);

router.delete("/delete-multiple", deleteManyCategories);


module.exports = router;
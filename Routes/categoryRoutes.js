const express = require("express");
const router = express.Router();
const { getCategories, getCategoryByName, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

// Get All Services
router.get("/", getCategories);

// Get Gategory By Name
router.get("/:id", getCategoryByName)

// Add Service
router.post("/", addCategory);

// Update Service
router.put("/update/:id", updateCategory);

// Delete Service
router.delete("/delete/:id", deleteCategory);

router.post("/delete-multiple", async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }

        await CategoryModel.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Categories deleted successfully" });
    } catch (error) {
        console.error("Error deleting categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
const categoryModal = require("../modals/CategoryModal");

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModal.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await categoryModal.findOne({ name });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

const addCategory = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const newCategory = await categoryModal.create({ name, slug });
        res.status(201).json({ message: "Category added", category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getCategories, getCategoryByName, addCategory };
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
        const { id } = req.params;
        console.log(id)
        const category = await categoryModal.findOne({ _id: id });
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

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Update service with converted category ID
        const updatedService = await categoryModal.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedService) return res.status(404).json({ message: "Service not found" });
        console.log(updatedService)

        res.json(updatedService);
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await categoryModal.findByIdAndDelete(id);
        if (!deletedService) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCategories, getCategoryByName, addCategory, updateCategory, deleteCategory };
const categoryModal = require("../modals/CategoryModal");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModal.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const getCategoryByName = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const category = await categoryModal.findOne({ _id: id });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const getSpecificCategories = async (req, res) => {
  try {
    const categoryNames = [
      "Web Applications",
      "App Development",
      "Web Development",
      "Search Engine Optimization",
      "Content Writing",
      "Graphic Designing",
      "Ecommerce Development",
      "Logo Design",
    ];

    // Case-insensitive matching
    const categories = await categoryModal
      .find({
        name: { $in: categoryNames },
      })
      .select("name slug")
      .lean();

    res.status(200).json({ data: categories, message: "Categories fetched successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message, success: false });
  }
};

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
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Update service with converted category ID
    const updatedService = await categoryModal.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedService)
      return res.status(404).json({ message: "Service not found" });
    console.log(updatedService);

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
    if (!deletedService)
      return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteManyCategories = async (req, res) => {
  try {
    const ids = req.query.ids.split(","); // Convert query string to array
    console.log(ids);
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await categoryModal.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Categories deleted successfully" });
  } catch (error) {
    console.error("Error deleting categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCategories,
  getCategoryByName,
  getSpecificCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
};

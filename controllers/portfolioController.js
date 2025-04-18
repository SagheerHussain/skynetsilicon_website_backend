const Portfolio = require("../modals/PortfolioModal");
const Category = require("../modals/CategoryModal");

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate("category");
    res.json({ portfolios, success: true, message: "Portfolios fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false, message: "Failed to fetch portfolios" });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findById(id).populate("category");
    if (!portfolio) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ portfolio, success: true, message: "Portfolio fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false, message: "Failed to fetch portfolio" });
  }
};

const getPortfolioByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const portfolios = await Portfolio.find({ category });
    res.json({ portfolios, success: true, message: "Portfolios fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false, message: "Failed to fetch portfolios" });
  }
};

const addPortfolio = async (req, res) => {
  try {
    // Validate if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "File is required", success: false, message: "File is required" });
    }

    const { title, description, category, link } = req.body;
    const imageUrl = req.file.path; // ✅ Cloudinary URL

    // ✅ Find the category by name and get its ObjectId
    const categoryExists = await Category.findOne({ name: category });

    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category selected", success: false, message: "Invalid category selected" });
    }

    // ✅ Now `categoryExists._id` is the correct ObjectId
    const newPortfolio = await Portfolio.create({
      title,
      description,
      category: categoryExists._id, // ✅ Use ObjectId instead of string
      link,
      src: imageUrl,
    });

    return res.status(201).json({ newPortfolio, success: true, message: "Portfolio added successfully" });
  } catch (err) {
    console.error("Error:", err.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message, success: false, message: "Failed to add portfolio" });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id, // Query to find the document
      req.body, // Data to update
      { new: true } // Options
    );
    console.log(updatedPortfolio);
    if (!updatedPortfolio)
      return res.status(404).json({ message: "Portfolio not found", success: false, message: "Portfolio not found" });
    res.json({ updatedPortfolio, success: true, message: "Portfolio updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false, message: "Failed to update portfolio" });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio)
      return res.status(404).json({ message: "Portfolio not found", success: false, message: "Portfolio not found" });
    res.json({ message: "Portfolio deleted successfully", success: true, message: "Portfolio deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false, message: "Failed to delete portfolio" });
  }
};

const deleteManyPortfolio = async (req, res) => {
  try {
    const ids = req.query.ids.split(","); // Convert query string to array
    console.log(ids);
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await Portfolio.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Portfolio deleted successfully", success: true, message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolios:", error);
    res.status(500).json({ error: error.message, success: false, message: "Failed to delete portfolios" });
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  getPortfolioByCategory,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  deleteManyPortfolio,
};

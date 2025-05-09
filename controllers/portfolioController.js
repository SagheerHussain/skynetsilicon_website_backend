const Portfolio = require("../modals/PortfolioModal");
const Category = require("../modals/CategoryModal");

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate("categories");
    res.json({
      portfolios,
      success: true,
      message: "Portfolios fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Failed to fetch portfolios",
    });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findById({ _id: id }).populate(
      "categories"
    );
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json({
      portfolio,
      success: true,
      message: "Portfolio fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Failed to fetch portfolio",
    });
  }
};

const getPortfolioByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const portfolios = await Portfolio.find({ category });
    res.json({
      portfolios,
      success: true,
      message: "Portfolios fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Failed to fetch portfolios",
    });
  }
};

const addPortfolio = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "File is required", success: false });
    }

    const { title, description, link } = req.body;

    // ✅ Parse categories from string to array
    let categories = [];
    if (req.body.categories) {
      try {
        categories = req.body.categories.split(",");
      } catch (err) {
        return res
          .status(400)
          .json({ error: "Invalid categories format", success: false });
      }
    }

    // // ✅ Ensure at least one category is selected
    if (!Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one category is required", success: false });
    }

    const imageUrl = req.file.path;

    const newPortfolio = await Portfolio.create({
      title,
      description,
      link,
      categories,
      src: imageUrl,
    });

    return res.status(201).json({
      newPortfolio,
      success: true,
      message: "Portfolio added successfully",
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
      success: false,
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link } = req.body;

    console.log(req.body, req.file);

    // ✅ Parse categories from string to array
    let categories = [];
    if (req.body.categories) {
      try {
        categories = req.body.categories.split(",");
      } catch (err) {
        return res
          .status(400)
          .json({ error: "Invalid categories format", success: false });
      }
    }

    // ✅ Ensure at least one category is selected
    if (!Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one category is required", success: false });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id, // Query to find the document
      {
        title,
        description,
        link,
        categories,
        src: req.file ? req.file.path : req.body.image,
      }, // Data to update
      { new: true } // Options
    );
    if (!updatedPortfolio)
      return res.status(404).json({
        message: "Portfolio not found",
        success: false,
      });
    res.json({
      updatedPortfolio,
      success: true,
      message: "Portfolio updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Failed to update portfolio",
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio)
      return res.status(404).json({
        message: "Portfolio not found",
        success: false,
        message: "Portfolio not found",
      });
    res.json({
      message: "Portfolio deleted successfully",
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
      message: "Failed to delete portfolio",
    });
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

    res.status(200).json({
      message: "Portfolio deleted successfully",
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolios:", error);
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Failed to delete portfolios",
    });
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

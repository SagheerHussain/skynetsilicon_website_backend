const Portfolio = require("../modals/PortfolioModal");
const Category = require("../modals/CategoryModal");

const getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().populate("category");
        res.json(portfolios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPortfolioByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const portfolios = await Portfolio.find({ category });
        res.json(portfolios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }cd
};

const addPortfolio = async (req, res) => {
 
    try {
        const { title, description, category } = req.body; // Getting text fields
        const file = req.file ? req.file.filename : null; // Getting uploaded file

        console.log("Received Data:", title, description, category, file); // Debugging
        if (!file) {
            return res.status(400).json({ error: "File is required" });
        }

        // Convert category string into ObjectId
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category selected" });
        }

        const newPortfolio = Portfolio.create({
            src: file,
            title,
            description,
            category: categoryExists._id // Store ObjectId instead of string
        });
        res.status(201).json(newPortfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPortfolio) return res.status(404).json({ message: "Portfolio not found" });
        res.json(updatedPortfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
        if (!deletedPortfolio) return res.status(404).json({ message: "Portfolio not found" });
        res.json({ message: "Portfolio deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPortfolios, getPortfolioByCategory, addPortfolio, updatePortfolio, deletePortfolio };
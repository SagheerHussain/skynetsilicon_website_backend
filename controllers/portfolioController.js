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

const getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolio = await Portfolio.findById(id).populate("category");
        if (!portfolio) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getPortfolioByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const portfolios = await Portfolio.find({ category });
        res.json (portfolios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addPortfolio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        const { title, description, category } = req.body;
        const imageUrl = req.file.path; // ✅ Cloudinary URL

        const newPortfolio = await Portfolio.create({
            title,
            description,
            category,
            src: imageUrl
        });

        return res.status(201).json(newPortfolio);
    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, req.body)
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            id,   // Query to find the document
            req.body,      // Data to update
            { new: true }  // Options
        );
        console.log(updatedPortfolio)
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

const deleteManyPortfolio = async (req, res) => {
    try {
        const ids = req.query.ids.split(','); // Convert query string to array
        console.log(ids)
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }

        await Portfolio.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (error) {
        console.error("Error deleting portfolios:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getPortfolios, getPortfolioById, getPortfolioByCategory, addPortfolio, updatePortfolio, deletePortfolio, deleteManyPortfolio };
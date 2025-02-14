const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
    src: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    title: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Portfolio", PortfolioSchema)
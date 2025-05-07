const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

categorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", categorySchema)
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    featured_list: [{ type: String, required: true }],
    service_explanation: [{
        title: { type: String, required: true },
        description: { type: String, required: true }
    }],
    why_you_need_service: [{
        title: { type: String, required: true },
        description: { type: String, required: true }
    }],
    why_choose_skynet: [{
        title: { type: String, required: true },
        description: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
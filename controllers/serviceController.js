const Service = require("../modals/ServiceModal");
const Category = require("../modals/CategoryModal");

const getServices = async (req, res) => {
    try {
        const services = await Service.find().populate("category");
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request params
        console.log(id)

        // Find the service by ID and populate the 'category' field
        const service = await Service.findById(id).populate("category");
        console.log(service)

        // If service is not found, return 404 error
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Return the service data
        res.json(service);
    } catch (err) {
        console.error("Error fetching service by ID:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getServiceByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const formattedCategory = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        const categoryExists = await Category.findOne({ name: formattedCategory });
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category selected" });
        }
        const service = await Service.findOne({ category: categoryExists._id }).populate("category");
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addService = async (req, res) => {
    try {
        const { title, description, category, featured_list, service_explanation, why_choose_skynet, why_you_need_service } = req.body;

        // Convert category string into ObjectId
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category selected" });
        }

        const newService = Service.create({
            title,
            description,
            category: categoryExists._id,
            featured_list,
            service_explanation,
            why_choose_skynet,
            why_you_need_service
        });
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        let { category, ...updateData } = req.body;

        // Check if category is a string (name) instead of ObjectId
        if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
            const categoryExists = await Category.findOne({ name: category });
            if (!categoryExists) {
                return res.status(400).json({ error: "Invalid category selected" });
            }
            category = categoryExists._id; // Convert category name to ObjectId
        }

        // Update service with converted category ID
        const updatedService = await Service.findByIdAndUpdate(id, { ...updateData, category }, { new: true });

        if (!updatedService) return res.status(404).json({ message: "Service not found" });

        res.json(updatedService);
    } catch (err) {
        console.error("Error updating service:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteManyServices = async (req, res) => {
    try {
        const ids = req.query.ids.split(','); // Convert query string to array
        console.log(ids)
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided" });
        }

        await Service.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Services deleted successfully" });
    } catch (error) {
        console.error("Error deleting services:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getServices, getServiceById, getServiceByCategory, addService, updateService, deleteService, deleteManyServices };

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

// const getServiceById = async (req, res) => {
//     try {
//         const { id } = req.params; // Extract ID from request params

//         // Find the service by ID and populate the 'category' field
//         const service = await Service.findById(id).populate("category");

//         // If service is not found, return 404 error
//         if (!service) {
//             return res.status(404).json({ message: "Service not found" });
//         }

//         // Return the service data
//         res.json(service);
//     } catch (err) {
//         console.error("Error fetching service by ID:", err.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

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
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedService) return res.status(404).json({ message: "Service not found" });
        res.json(updatedService);
    } catch (err) {
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

module.exports = { getServices, getServiceByCategory, addService, updateService, deleteService };

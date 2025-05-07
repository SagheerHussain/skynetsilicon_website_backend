// ✅ Optimized serviceController.js with lean(), select(), timing, and optional node-cache

const Service = require("../modals/ServiceModal");
const Category = require("../modals/CategoryModal");
const cache = require("../utils/cache");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("category").lean();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate("category").lean();
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getServiceByCategory = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `service-${category}`;

  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const formattedCategory = category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const categoryExists = await Category.findOne({ name: formattedCategory });
  if (!categoryExists) return res.status(400).json({ error: "Invalid category" });

  const service = await Service.findOne({ category: categoryExists._id })
    .populate("category", "name")
    .select("title description featured_list service_explanation why_choose_skynet why_you_need_service category")
    .lean();

  if (!service) return res.status(404).json({ message: "Not found" });

  cache.set(cacheKey, service); // ✅ Save result to memory
  res.json(service);
};

const addService = async (req, res) => {
  try {
    const { title, description, category, featured_list, service_explanation, why_choose_skynet, why_you_need_service } = req.body;
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) return res.status(400).json({ error: "Invalid category selected" });

    const newService = await Service.create({
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

    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) return res.status(400).json({ error: "Invalid category selected" });
      category = categoryExists._id;
    }

    const updatedService = await Service.findByIdAndUpdate(id, { ...updateData, category }, { new: true });
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

const deleteManyServices = async (req, res) => {
  try {
    const ids = req.query.ids.split(",");
    if (!ids.length) return res.status(400).json({ message: "No IDs provided" });
    await Service.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Services deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getServices,
  getServiceById,
  getServiceByCategory,
  addService,
  updateService,
  deleteService,
  deleteManyServices
};

const express = require("express");
const router = express.Router();

const { getServices,  getServiceByCategory, addService, updateService, deleteService } = require("../controllers/serviceController")

// Get All Services
router.get("/", getServices);

// Get Service By Id
// router.get("/:id", getServiceById)

// Get Service By Category
router.get("/:category", getServiceByCategory);

// Add Service
router.post("/", addService);

// Update Service
router.patch("/:id", updateService);

// Delete Service
router.delete("/:id", deleteService);

module.exports = router;
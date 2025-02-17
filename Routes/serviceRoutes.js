const express = require("express");
const router = express.Router();
const { 
    getServices, 
    getServiceById, 
    getServiceByCategory, 
    addService, 
    updateService, 
    deleteService 
} = require("../controllers/serviceController");

// Get All Services
router.get("/", getServices);

// Get Service By Id (Keep it as is)
router.get("/id/:id", getServiceById);  // 👈 Changed the route to avoid conflict

// Get Service By Category (Modified)
router.get("/category/:category", getServiceByCategory);  // 👈 Changed the route to avoid conflict

// Add Service
router.post("/", addService);

// Update Service
router.patch("/update/:id", updateService);

// Delete Service
router.delete("/delete/:id", deleteService);

module.exports = router;

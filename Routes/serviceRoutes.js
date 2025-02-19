const express = require("express");
const router = express.Router();
const { 
    getServices, 
    getServiceById, 
    getServiceByCategory, 
    addService, 
    updateService, 
    deleteService,
    deleteManyServices 
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
router.put("/update/:id", updateService);

// Delete Service
router.delete("/delete/:id", deleteService);

// Delete Many Services
router.delete("/delete-multiple", deleteManyServices);

module.exports = router;

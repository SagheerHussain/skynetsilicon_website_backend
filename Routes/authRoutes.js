const express = require("express");
const router = express.Router();
const { getRegisterAdmin, getLoginAdmin } = require("../controllers/authController");

// Login User
router.post("/login", getLoginAdmin);

// Register User
router.post("/register", getRegisterAdmin);

// Get User
// router.get("/user", );

module.exports = router;
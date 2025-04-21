const express = require("express");
const router = express.Router();
const { getRegisterAdmin, getLoginAdmin, getUserDetails, forgetPassword, resetPassword } = require("../controllers/authController");

// Login User
router.post("/login", getLoginAdmin);

// Register User
router.post("/register", getRegisterAdmin);

// Get User
router.get("/user", getUserDetails);

// Forget Password
router.post("/forget-password", forgetPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
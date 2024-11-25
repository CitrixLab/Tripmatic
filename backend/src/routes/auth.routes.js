
//auth.route.js



const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller'); 
const { authenticateToken } = require("../middleware/AuthStrategy");
const uploadMulter = require('../middleware/uploadMulter');

// Authentication Routes
// Route for creating a new user account
router.post("/register", authController.registerUser);

// Route for authenticating users and providing a token'

router.post("/login", authController.login);

// Route for changing the user's password  
router.put("/change-password", [authenticateToken], authController.changePassword);

// Route for requesting a password reset link via email
router.post("/forgot-password", authController.forgotPassword);

// Route for verifying a user's email address
router.post("/verify-email", authController.verifyEmail);

// User Account Management Routes
// Requires authentication for the following routes

// Route for retrieving the authenticated user's information
router.get("/user", [authenticateToken], authController.getUser);

// Route for updating the authenticated user's information
router.put("/user", [authenticateToken], authController.updateUser);

// Route to delete the authenticated user's account
router.delete("/user", [authenticateToken], authController.deleteUser);

// Route to upload a user's profile picture
// Uses `uploadSingleImg` middleware for handling file uploads
router.post("/user/upload-profile/:id", [authenticateToken, uploadMulter.uploadSingleImg], authController.uploadProfile);

// Utility Route (for testing purposes)
// Sends a test email
router.post("/test-email", authController.sendEmail);

module.exports = router; 

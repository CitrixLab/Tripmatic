const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { authenticateToken } = require("../middleware/AuthStrategy");
const uploadMulter = require('../middleware/uploadMulter');


// registration
router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/change-password", authController.changePassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/upload-profile/:id", [authenticateToken, uploadMulter.uploadSingleImg], authController.uploadProfile);
router.post("/test-email", authController.sendEmail);

router.get("/user", [authenticateToken], authController.getUser);

router.put("/user", [authenticateToken], authController.updateUser);

module.exports = router;

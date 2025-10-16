const express = require("express");
const router = express.Router();
const { login, requestOtp, verifyOtp, resetPassword } = require("../controllers/authController");

// Auth routes
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;

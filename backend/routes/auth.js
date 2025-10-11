const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, regNo: user.regNo },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Helper: Send OTP Email (using nodemailer)
const sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { regNo, password } = req.body;
  try {
    const user = await User.findOne({ regNo });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        regNo: user.regNo,
        emailCollege: user.emailCollege,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/request-otp
router.post("/request-otp", async (req, res) => {
  const { regNoOrEmail } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ regNo: regNoOrEmail }, { emailCollege: regNoOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(user.emailCollege, otp);
    res.json({ message: "OTP sent to registered college email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  const { regNoOrEmail, otp } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ regNo: regNoOrEmail }, { emailCollege: regNoOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { regNoOrEmail, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ regNo: regNoOrEmail }, { emailCollege: regNoOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    user.password = newPassword; // will be hashed by pre-save middleware
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

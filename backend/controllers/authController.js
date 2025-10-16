import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  let { regNo, password } = req.body;
  regNo = regNo.trim().toUpperCase();

  try {
    const user = await User.findOne({ regNo });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // First login with default password enforcement
    if (user.isFirstLogin && password === "default123") {
      return res.status(200).json({
        firstLogin: true,
        message: "Reset password required",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, regNo: user.regNo },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        regNo: user.regNo,
        emailCollege: user.emailCollege,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Request OTP for password reset
// @route POST /api/auth/request-otp
// @access Public
export const requestOtp = async (req, res) => {
  let { regNo } = req.body;
  if (!regNo) return res.status(400).json({ message: "regNo is required" });

  regNo = regNo.trim().toUpperCase();

  try {
    const user = await User.findOne({ regNo });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp(6);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOtpEmail(user.emailCollege, otp);

    res.status(200).json({ message: "OTP sent to your college email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Verify OTP
// @route POST /api/auth/verify-otp
// @access Public
export const verifyOtp = async (req, res) => {
  let { regNo, otp } = req.body;
  regNo = regNo.trim().toUpperCase();

  try {
    const user = await User.findOne({ regNo });
    if (
      !user ||
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Reset Password
// @route POST /api/auth/reset-password
// @access Public
export const resetPassword = async (req, res) => {
  let { regNo, newPassword, confirmPassword } = req.body;
  regNo = regNo.trim().toUpperCase();

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ regNo });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // Will be hashed automatically via pre-save hook
    user.otp = null;
    user.otpExpiry = null;
    user.isFirstLogin = false;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

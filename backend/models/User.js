const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User Schema
const UserSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true, maxlength: 10 },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty"], required: true },
  
  // Emails
  emailCollege: { type: String, required: true, lowercase: true, unique: true },
  emailPersonal: { type: String, lowercase: true },

  // Contact
  phoneNo: { type: String, maxlength: 10 },

  // Student-specific info
  branchSection: { type: String },
  graduationYear: { type: Number, min: 1900, max: 2100 },

  // Login / Authentication
  isFirstLogin: { type: Boolean, default: true },
  otp: { type: String },
  otpExpiry: { type: Date },

  // Opportunity tracking (for students)
  registeredOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
  notRegisteredOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
  ignoredOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  this.regNo = this.regNo.trim().toUpperCase();
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Optional: Check if OTP is valid
UserSchema.methods.isOtpValid = function(enteredOtp) {
  return this.otp === enteredOtp && this.otpExpiry && this.otpExpiry > Date.now();
};

module.exports = mongoose.model("User", UserSchema);

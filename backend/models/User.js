const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true, maxlength: 10 },
  password: { type: String, required: true },
  emailCollege: { type: String, required: true, lowercase: true },
  role: { type: String, enum: ["student", "faculty"], required: true },
  otp: String,
  otpExpiry: Date,
  // add other fields like phoneNo, branchSection, graduationYear as needed
});

// Password hash middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

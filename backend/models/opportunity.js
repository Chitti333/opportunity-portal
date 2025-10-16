const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  applicationLink: { type: String, required: true },
  jobDescription: { type: String },
  eligibleGraduationYears: [{ type: Number, required: true }], // Array of eligible years
  additionalInformation: { type: String },
  dueDate: { type: Date, required: true },

  // Track student responses
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notRegisteredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  ignoredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Faculty who posted this opportunity
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

module.exports = mongoose.model("Opportunity", OpportunitySchema);

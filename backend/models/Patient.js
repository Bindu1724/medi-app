const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  age:{ type: Number, required: true },
  // .. other fields like  caretakerId, etc.
});

module.exports = mongoose.model("Patient", patientSchema);
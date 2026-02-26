const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  dosage: String,
  schedule: String, // e.g. "Morning, Evening"
});

module.exports = mongoose.model('Medication', medicationSchema);
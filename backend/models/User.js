const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['patient', 'caretaker'] },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  caretakerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('User', userSchema);
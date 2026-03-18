const mongoose = require("mongoose");

const notificationSettingsSchema = new mongoose.Schema({
  caretakerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emailEnabled: { type: Boolean, default: false },
  emailAddress: { type: String },
  missedAlertsEnabled: { type: Boolean, default: false },
  alertDelay: { type: String },   // e.g. "2 hours"
  reminderTime: { type: String }  // e.g. "20:00"
}, { timestamps: true });

module.exports = mongoose.model("NotificationSettings", notificationSettingsSchema);

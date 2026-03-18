// routes/caretaker.js
const express = require('express');
const NotificationSettings = require("../models/NotificationSettings");


const router = express.Router();

router.post("/notification-settings", async (req, res) => {
  try {
    const { caretakerId, emailEnabled, emailAddress, missedAlertsEnabled, alertDelay, reminderTime } = req.body;

    // Save settings in DB (you need a model, e.g., NotificationSettings)
    const settings = new NotificationSettings({
      caretakerId,
      emailEnabled,
      emailAddress,
      missedAlertsEnabled,
      alertDelay,
      reminderTime
    });

    await settings.save();

    res.json({ message: "Notification settings saved successfully", settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
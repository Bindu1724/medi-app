// backend/routes/notifications.js
const express = require('express');
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-reminder", async (req, res) => {
  const { patientName, caretakerEmail } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or Outlook, or any SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: caretakerEmail,
      subject: `Medication Reminder for ${patientName}`,
      text: `Hello,\n\nThis is a reminder that ${patientName} has not taken all medication today.\nPlease check with ${patientName}.\n\nRegards,\nMedication Tracker`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reminder email sent successfully" });
  } catch (err) {
    console.error("Error sending reminder:", err.message, err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;
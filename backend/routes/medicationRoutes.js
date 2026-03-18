const express = require('express');
const Medication = require('../models/Medication');

const router = express.Router();

// CREATE medication (no auth)
router.post("/", async (req, res) => {
  try {
    const { userId, name, time, date, status, days, dosage} = req.body;

    const startDate = new Date(); // today
    let medsToInsert = [];

        for (let i = 0; i < days; i++) {
      const medDate = new Date(startDate);
      medDate.setDate(startDate.getDate() + i);

      medsToInsert.push({
        userId,
        name,
        time,
        dosage,
        date: medDate.toISOString().split("T")[0], // YYYY-MM-DD
        status: "pending"
      });
    }

  const createdMeds = await Medication.insertMany(medsToInsert);
    res.status(201).json(createdMeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add medications" });
  }
});


// GET all medications (no auth)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const meds = await Medication.find({ userId }).sort({ date: 1 });
    res.json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE medication status (no auth)
router.put("/:id", async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status },
      { new: true }
    );

    if (!med) return res.status(404).json({ error: "Medication not found" });

    res.json(med);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get recent activity for a specific patient
// GET /api/medications/recent-activity/:patientId
router.get('/recent-activity/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch last 10 medications for this patient, sorted by date/time
    const meds = await Medication.find({ userId: patientId })
      .sort({ date: -1, time: -1 })
      .limit(10);

    // Map them into the format your frontend expects
    const activities = meds.map(med => ({
      name: med.name,
      dosage: med.dosage, // or add a dosage field if you have one
      time: `${med.date} ${med.time}`,
      status: med.status === 'taken'
        ? 'Taken'
        : med.status === 'missed'
        ? 'Missed'
        : 'Pending'
    }));

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
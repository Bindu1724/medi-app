const express = require('express');
const Medication = require('../models/Medication');

const router = express.Router();

// Get all medications
router.get('/', async (req, res) => {
  const meds = await Medication.find();
  res.json(meds);
});

// Add medication
router.post('/', async (req, res) => {
  const med = new Medication(req.body);
  await med.save();
  res.json(med);
});

// Update medication
router.put('/:id', async (req, res) => {
  const med = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(med);
});

// Delete medication
router.delete('/:id', async (req, res) => {
  await Medication.findByIdAndDelete(req.params.id);
  res.json({ message: "Medication deleted" });
});

module.exports = router;
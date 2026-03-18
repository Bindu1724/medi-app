const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Medication = require('../models/Medication');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, gender, role } = req.body;  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ save role along with user
    const user = new User({ name, email, password: hashedPassword, gender, role });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, gender, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

     if (user.role !== role) {
    return res.status(403).json({ error: "Role mismatch. Please login with correct role." });
  }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
        gender:user.gender   
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get patients for caretaker
router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find({
      role: "patient"
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Assign caretaker to patient
router.put("/assign-caretaker", async (req, res) => {
  const { patientId, caretakerId } = req.body;
  console.log("Assign caretaker request:", req.body);

  try {
    const patient = await User.findByIdAndUpdate(
      patientId,
      { caretakerId },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }


    res.json({ message: "Caretaker assigned successfully", patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/caretaker/reports/:patientId
router.get(`/caretaker/reports/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const meds = await Medication.find({ userId: id });
    console.log("Fetched meds:", meds);

    // If meds is empty, return early
    if (!meds || meds.length === 0) {
      return res.json({ adherenceRate: 0, streak: 0, missed: 0, taken: 0 });
    }

    // Adherence rate
    const taken = meds.filter(m => m.status === "taken").length;
    const missed = meds.filter(m => m.status === "missed").length;
    const adherenceRate = meds.length ? Math.round((taken / meds.length) * 100) : 0;

    // Current streak
    const medsByDate = {};
    meds.forEach(med => {
      const dateStr = med.date; 
      if (!medsByDate[dateStr]) medsByDate[dateStr] = [];
      medsByDate[dateStr].push(med);
    });
    const dates = Object.keys(medsByDate).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    for (const date of dates) {
      const medsForDay = medsByDate[date];
      const allTaken = medsForDay.every(m => m.status === "taken");
      if (allTaken) streak++;
      else break;
    }

    // Missed this month
    const currentMonth = new Date().getMonth();
    const missedThisMonth = meds.filter(
      m => new Date(m.date).getMonth() === currentMonth && m.status === "missed"
    ).length;

    // Taken this week (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const takenThisWeek = meds.filter(m => {
      const d = new Date(m.date);
      return d >= sevenDaysAgo && d <= today && m.status === "taken";
    }).length;

    res.json({ adherenceRate, streak, missed: missedThisMonth, taken: takenThisWeek });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
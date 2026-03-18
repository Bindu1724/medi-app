// src/components/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import Header from './header.js';
import axios from 'axios';
import MedicationForm from './MedicationForm.js';
import '../styles/patient.css';
import '../styles/medication.css';
import Footer from './footer.js';
import { getMedications } from "../services/medicationService";
import { getUser } from "../utils/auth";
import getGreeting from './greet.js';
import getBadgeClass from '../utils/badgeUtils.js';

 
function PatientDashboard() {
  const { userId, token, name } = getUser();
  const [medications, setMedications] = useState([]);
  const[streak, setStreak] = useState(0);
  const [todayStatus, setTodayStatus] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [patientName, setPatientName] = useState(name || "");
  

 
  // ---- CALCULATE STATS ----
  useEffect(() => {
  if (medications.length === 0) return;

  const today = new Date().toISOString().split("T")[0];

  // ---- TODAY'S STATUS ----
  const todaysMeds = medications.filter(m => m.date === today);
  const takenToday = todaysMeds.filter(m => m.status === "taken").length;
  const todaysStatus = todaysMeds.length > 0 
    ? Math.round((takenToday / todaysMeds.length) * 100)
    : 0;

  // ---- MONTHLY RATE ----
  const currentMonth = new Date().getMonth();
  const monthlyMeds = medications.filter(m => new Date(m.date).getMonth() === currentMonth);
  const monthlyTaken = monthlyMeds.filter(m => m.status === "taken").length;
  const monthlyRate = monthlyMeds.length > 0
    ? Math.round((monthlyTaken / monthlyMeds.length) * 100)
    : 0;

  // ---- STREAK CALCULATION ----
  let streakCount = 0;
  let dayPointer = new Date();

  while (true) {
    const dateStr = dayPointer.toISOString().split("T")[0];
    const medsForDay = medications.filter(m => m.date === dateStr);

    if (medsForDay.length === 0) break;

    const allTaken = medsForDay.every(m => m.status === "taken");
    if (!allTaken) break;

    streakCount++;
    dayPointer.setDate(dayPointer.getDate() - 1);
  }

  setStreak(streakCount);
  setTodayStatus(todaysStatus);
  setMonthlyRate(monthlyRate);

}, [medications]);

  // ---- FETCH MEDICATIONS ----
  useEffect(() => {
    async function fetchMeds() {
      try {
        const meds = await getMedications(userId, token);
        setMedications(meds);
      } catch (err) {
        console.error("Error fetching medications:", err);
      }
    }
    if (userId) fetchMeds();
  }, [userId, token]);



  // ---- MARK AS TAKEN ----
  const markAsTaken = async (id) => {
    console.log("Clicked:", id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`https://medi-app-1ujt.onrender.com/api/medications/${id}`, { userId: localStorage.getItem('userId'), status: 'taken' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(medications.map(m => m._id === id ? res.data : m));
    } catch (err) {
      console.error(err);
    }
  };
 
  // ---- FETCH PATIENT INFO ----
  useEffect(() => {
  async function fetchPatient() {
    try {
      const res = await axios.get(`https://medi-app-1ujt.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Patient data:", res.data);
      setPatientName(res.data.name); // assuming backend returns { name: "..." }
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  }
  if (userId) fetchPatient();
}, [userId, token]);

return (
  <>
    < Header />
    <div className="container mt-4">
      <h2 className="p-3 text-success text-center">Patient Dashboard</h2>
      <div className="p-3 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3">
        <h1 className="greet-item">{getGreeting()}, {patientName}!</h1>
        <p className="greet-item">Ready to stay on track with your medication?</p>

        <div className="d-flex justify-content-around p-3 mt-4">
          <div className="text-center">
            <h2 className="stats-item">{streak}</h2>
            <p className="stats-item">Day Streak</p>
          </div>

          <div className="text-center">
            <h2 className="stats-item">{todayStatus}%</h2>
            <p className="stats-item">Today's Status</p>
          </div>

          <div className="text-center">
            <h2 className="stats-item">{monthlyRate}%</h2>
            <p className="stats-item">Monthly Rate</p>
          </div>
        </div>
      </div>

      <MedicationForm onAdd={(newMeds) => setMedications([...medications, ...newMeds])} />

      {/* Today's Medications */}
      <div className="container p-3 bg-success-subtle border border-success-subtle rounded-3 mt-4">
        <h5 className="card-header text-success p-2 m-2">Today's Medications</h5>
        {medications.length === 0 ? (
          <p className="p-3 text-muted">No medications scheduled yet.</p>
        ) : (
          <div className="row">
            {medications
              .filter(med => med.date === new Date().toISOString().split("T")[0]) // ✅ only today
              .map((med) => (
                <div key={med._id} className="col-md-6 mb-3">
                  <div className="card p-3 d-flex flex-column justify-content-between">
                    <div>
                      <strong>{med.name}</strong>
                      <div className="text-muted">
                        at {med.time} — <span className={getBadgeClass(med.status)}>{med.status}</span>
                      </div>
                    </div>
                    {med.status === 'pending' && (
                      <button
                        className="btn btn-success btn-sm mt-2"
                        onClick={() => markAsTaken(med._id)}
                      >
                        Mark as Taken
                      </button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Upcoming Medications */}
<div className="container p-3 bg-success-subtle border border-success-subtle rounded-3 mt-4">
  <h5 className="card-header text-success p-2 m-2">Upcoming Medications</h5>
  {medications.filter(med => med.date > new Date().toISOString().split("T")[0]).length === 0 ? (
    <p className="p-3 text-muted">No upcoming medications scheduled.</p>
  ) : (
    <div className="row">
      {medications
        .filter(med => med.date > new Date().toISOString().split("T")[0]) // ✅ only future dates
        .map((med) => (
          <div key={med._id} className="col-md-6 mb-3">
            <div className="card p-3 d-flex flex-column justify-content-between">
              <div>
                <strong>{med.name}</strong>
                <div className="text-muted">
                  {med.date} at {med.time} — <span className={getBadgeClass(med.status)}>{med.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )}
</div>

    <div className="d-flex justify-content-center align-items-center">
        <Footer />
      </div>
  </>
);
}

export default PatientDashboard;
// src/components/Notification.js
import { useState } from 'react';
import { FaEnvelope, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { getUser } from "../utils/auth";

function Notification({ patientName, patientGender, adherenceRate, streak, medications = [] }) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const [missedAlertsEnabled, setMissedAlertsEnabled] = useState(true);
  const [alertDelay, setAlertDelay] = useState('2 hours');
  const [reminderTime, setReminderTime] = useState('20:00');

  const today = new Date().toISOString().split("T")[0];
  const todaysMeds = medications.filter(med => med.date === today);
  const allTaken = todaysMeds.length > 0 && todaysMeds.every(med => med.status === "taken");
  
  
  const gender = patientGender?.toLowerCase();
  const pronoun = gender === "female" ? "her" : gender === "male" ? "his" : "their";
  const subjectPronoun = gender === "female" ? "she" : gender === "male" ? "he" : "they";
  

  // ✅ Save handler
  const handleSaveSettings = async () => {
  try {
    const user = getUser();
    console.log("User object:", user);

    const payload = {
      caretakerId: user?.userId, // adjust based on your user object
      emailEnabled,
      emailAddress,
      missedAlertsEnabled,
      alertDelay,
      reminderTime
    };

    await axios.post("https://medi-app-1ujt.onrender.com/caretaker/notification-settings", payload);
    alert("Settings saved successfully");

    // Reset individual states so UI clears
    setEmailEnabled(false);
    setEmailAddress("");
    setMissedAlertsEnabled(false);
    setAlertDelay("");
    setReminderTime("");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to save settings: " + (err.response?.data?.error || err.message));
  }
};

// Calculate streak from medications
const medsByDate = {};
medications.forEach(med => {
  if (!medsByDate[med.date]) medsByDate[med.date] = [];
  medsByDate[med.date].push(med);
});

const dates = Object.keys(medsByDate).sort((a, b) => new Date(b) - new Date(a));
let currentStreak = 0;
for (const date of dates) {
  const medsForDay = medsByDate[date];
  const allTakenDay = medsForDay.every(m => m.status === "taken");
  if (allTakenDay) {
    currentStreak++;
  } else {
    break; // stop streak when a missed day is found
  }
}

  return (
    <div className="card shadow p-3 mb-4">
      <div className="card-body">
        <h5 className="card-title text-success mb-3">
          <FaBell className="me-2" /> Notification Preferences
        </h5>

        {/* Email Notifications */}
        <div className="mb-4">
          <h6>Email Notifications</h6>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={emailEnabled}
              onChange={() => setEmailEnabled(!emailEnabled)}
              id="emailAlerts"
            />
            <label className="form-check-label" htmlFor="emailAlerts">
              Enable Email Alerts
            </label>
          </div>
          {emailEnabled && (
            <input
              type="email"
              className="form-control mt-2"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter caretaker email"
            />
          )}
        </div>

        {/* Missed Medication Alerts */}
        <div className="mb-4">
          <h6>Missed Medication Alerts</h6>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={missedAlertsEnabled}
              onChange={() => setMissedAlertsEnabled(!missedAlertsEnabled)}
              id="missedAlerts"
            />
            <label className="form-check-label" htmlFor="missedAlerts">
              Enable Missed Medication Alerts
            </label>
          </div>
          {missedAlertsEnabled && (
            <>
              <label className="form-label mt-2">Alert me if medication isn't taken within:</label>
              <select
                className="form-select"
                value={alertDelay}
                onChange={(e) => setAlertDelay(e.target.value)}
              >
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
              </select>

              <label className="form-label mt-3">Daily Reminder Time:</label>
              <input
                type="time"
                className="form-control"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <small className="text-muted">Time to check if today's medication was taken</small>
            </>
          )}
        </div>

        {/* Notification Preview */}
        <div className={`border rounded p-3 bg-light`}>
  <h6 className={`${allTaken ? "text-primary" : "text-danger"} mb-2`}>
    <FaEnvelope className="me-2" /> Medication Alert – {patientName}
  </h6>
  <p>Hello,</p>

  {allTaken ? (
    <>
      <p>
        Good news! <strong>{patientName}</strong> has taken all prescribed medication today.
      </p>
      <p>
        Current adherence rate:{" "}
        <span className="text-success fw-bold">{adherenceRate}%</span>{" "}
        (<span className="text-primary">{currentStreak}-day streak</span>)
      </p>
    </>
  ) : (
    <>
      <p>
        This is a reminder that <strong>{patientName}</strong> has not taken all medication today.
      </p>
      <p>
        Please check with {patientName} to ensure {subjectPronoun} takes {pronoun} prescribed medication.
      </p>
      <p>
        <strong>Current adherence rate:</strong>{" "}
        <span className="text-success fw-bold">{adherenceRate}%</span>{" "}
        (<span className="text-primary">{streak}-day streak</span>)
      </p>
    </>
  )}
</div>

        <button className="btn btn-success mt-3" onClick={handleSaveSettings}>
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}

export default Notification;
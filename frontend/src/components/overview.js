// src/components/Overview.js
import { useState, useEffect } from 'react';
import { FaCalendar, FaCog } from 'react-icons/fa';
import axios from 'axios';
import MonthlyAdherenceProgress from './monthlyadherence.js';
import { useNavigate } from "react-router-dom";
import getBadgeClass from '../utils/badgeUtils.js';


function Overview({patientId, patientName, patientGender }) {
  // State for medication status
  const [medications, setMedications] = useState([]);
  const [adherenceRate, setAdherenceRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [missedThisMonth, setMissedThisMonth] = useState(0);
  const [takenThisWeek, setTakenThisWeek] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const today = new Date().toISOString().split("T")[0];
  const todaysMeds = medications.filter(med => med.date === today);


  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        if (!patientId) return; // ✅ only fetch when patient selected
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://medi-app-1ujt.onrender.com/api/medications?userId=${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        // If you want adherence stats, you’ll need to calculate them here
      const taken = data.filter(m => m.status === "taken").length;
      const missed = data.filter(m => m.status === "missed").length;
      const adherenceRate = data.length ? Math.round((taken / data.length) * 100) : 0;
      
      // ✅ streak calculation
      const medsByDate = {};
      data.forEach(med => {
        if (!medsByDate[med.date]) medsByDate[med.date] = [];
        medsByDate[med.date].push(med);
      });
      const dates = Object.keys(medsByDate).sort((a, b) => new Date(b) - new Date(a));
      let streak = 0;
      for (const date of dates) {
        const medsForDay = medsByDate[date];
        const allTaken = medsForDay.every(m => m.status === "taken");
        if (allTaken) streak++;
        else break;
      }


        setMedications(data || []);
        setAdherenceRate(adherenceRate);
        setCurrentStreak(streak);
        setMissedThisMonth(missed);
        setTakenThisWeek(taken);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverviewData();
  }, [patientId]); // ✅ refetch when patient changes


  return (
    <div className="row g-4  ">
      {/* Today's Status */}
      <div className="col-md-4 ">
        <div className="card shadow h-100">
          <div className="card-body text-center">
            <h5 className="card-title text-success mb-3">
              <FaCalendar className="me-2" /> Today's Status
            </h5>
            <p className="fw-bold">Daily Medication Set</p>
            {todaysMeds.length === 0 ? (
              <p className="p-3 text-muted">No medications scheduled today.</p>
) : (
  <div className="row">
    {todaysMeds.map((med) => (
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
        </div>
      </div>

      {/* Monthly Adherence */}
      <div className="col-md-4">
        <div className="card shadow h-100">
          <div className="card-body text-center">
            <h5 className="card-title text-success mb-3">Monthly Adherence</h5>
            <MonthlyAdherenceProgress
              taken={takenThisWeek}
              missed={missedThisMonth}
              remaining={30 - (takenThisWeek + missedThisMonth)} 
            />
            <p className="mt-3">
              <strong>Adherence Rate:</strong> {adherenceRate}% <br />
              <strong>Current Streak:</strong> {currentStreak} days
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-md-4">
        <div className="card shadow h-100">
          <div className="card-body">
            <h5 className="card-title text-success mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              
              <button 
               className="btn btn-warning"
                  onClick={async () => {
                  try {
                      const caretakerEmail = "caretaker@example.com"; // or from state
                        await axios.post("https://medi-app-1ujt.onrender.com/api/notifications/send-reminder",
                              { caretakerEmail, patientName },
                              { headers: { Authorization: `Bearer ${token}` } }
                        );
                      alert("Reminder email sent successfully!");
                  } catch (err) {
                  alert("Failed to send reminder: " + err.message);
                }
              }}
              >
                   Send Reminder Email
                </button>
              <button className="btn btn-outline-success" 
                onClick={() => navigate("/caretaker-dashboard/notifications", { state: { patientId,  patientName, patientGender, adherenceRate, streak: currentStreak, medications
 } })}>
                <FaCog className="me-2"  /> Configure Notifications
              </button>
              <button className="btn btn-outline-success" 
                onClick={() => navigate("/caretaker-dashboard/calendar", { state: { patientId } })}>
                <FaCalendar className="me-2" /> View Full Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
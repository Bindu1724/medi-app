import Notification from './notification.js';
import CalendarView from './CalenderView.js';
import RecentActivity from './recentactivity.js';
import Overview from './overview.js';
import axios from 'axios';
import '../styles/patient.css';
import { useState, useEffect, useCallback } from 'react';
import Footer from './footer.js';
import Header from './header.js';
import { getUser } from "../utils/auth";

function CaretakerView() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [adherenceRate, setAdherenceRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [missedThisMonth, setMissedThisMonth] = useState(0);
  const [takenThisWeek, setTakenThisWeek] = useState(0);
  const { userId, token } = getUser(); // caretaker’s ID
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState(""); // ✅ new state
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);
  const [assignedPatientId, setAssignedPatientId] = useState("");
  const [medications, setMedications] = useState([]);

  // fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://medi-app-1ujt.onrender.com/api/users/patients",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatients(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching patients:", err);
      return [];
    }
  }, [token]);

  // fetch reports
 const fetchReports = useCallback(async (id) => {
  if (!id) return;
  const res = await axios.get(`https://medi-app-1ujt.onrender.com/api/users/caretaker/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = res.data;
  setAdherenceRate(data.adherenceRate);
  setCurrentStreak(data.streak);
  setMissedThisMonth(data.missed);
  setTakenThisWeek(data.taken);
}, [token]);

  // fetch medications for assigned patient
  useEffect(() => {
    async function fetchMeds() {
      try {
        if (assignedPatientId) {
          const res = await axios.get(
            `https://medi-app-1ujt.onrender.com/api/medications?userId=${assignedPatientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMedications(res.data);
        }
      } catch (err) {
        console.error("Error fetching medications:", err);
      }
    }
    fetchMeds();
  }, [assignedPatientId, token]);

  // assign caretaker
  const assignCaretaker = async () => {
    try {
      await axios.put("https://medi-app-1ujt.onrender.com/api/users/assign-caretaker",
        { patientId, caretakerId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Caretaker assigned successfully!");
      const assignedPatient = patients.find(p => p._id === patientId);
      if (assignedPatient) {
        setPatientName(assignedPatient.name);
        setPatientGender(assignedPatient.gender);
      }

      setAssignedPatientId(patientId);

      // ✅ Save patient details in localStorage
      localStorage.setItem("assignedPatient", JSON.stringify({
        id: patientId,
        name: assignedPatient?.name || "",
        gender: assignedPatient?.gender || ""
      }));

      fetchReports(patientId);
    } catch (err) {
      console.error(err);
      alert("Failed to assign caretaker");
    }
  };


  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // ✅ Restore patient when component loads
  useEffect(() => {
  const savedPatient = localStorage.getItem("assignedPatient");
  if (savedPatient) {
    const parsed = JSON.parse(savedPatient);
    setAssignedPatientId(parsed.id);
    setPatientName(parsed.name);
    setPatientGender(parsed.gender);
    fetchReports(parsed.id); // reload stats
  }
}, [fetchReports]);


  return (
    <>
      <Header/>
      <div className="container mt-4">
        <h2 className="p-3 text-success text-center">Caretaker Dashboard!</h2>

        <select
          className="form-select form-select-lg mb-3"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <button
          className="btn btn-success"
          onClick={assignCaretaker}
          disabled={!patientId}
        >
          Assign Caretaker
        </button>

        <h4 className="text-success text-center">
          Monitoring <strong>{patientName}</strong>'s Medication
        </h4>

        {/* Stats */}
        <div className="d-flex justify-content-around p-4 mt-3 bg-success-subtle border border-success-subtle rounded-3">
          <div className="text-center">
            <h2 className="stats-item ">{adherenceRate}%</h2>
            <p className="stats-item">Adherence Rate</p>
          </div>
          <div className="text-center">
            <h2 className="stats-item ">{currentStreak}</h2>
            <p className="stats-item">Current Streak</p>
          </div>
          <div className="text-center">
            <h2 className="stats-item ">{missedThisMonth}</h2>
            <p className="stats-item">Missed this month</p>
          </div>
          <div className="text-center">
            <h2 className="stats-item ">{takenThisWeek}</h2>
            <p className="stats-item">Taken this week</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex justify-content-center my-3">
        <div className="btn-group" role="group">
          <button className={`btn btn-outline-success ${activeTab === "Overview" ? "active" : ""}`} onClick={() => setActiveTab("Overview")}>Overview</button>
          <button className={`btn btn-outline-success ${activeTab === "RecentActivity" ? "active" : ""}`} onClick={() => setActiveTab("RecentActivity")}>Recent Activity</button>
          <button className={`btn btn-outline-success ${activeTab === "CalendarView" ? "active" : ""}`} onClick={() => setActiveTab("CalendarView")}>Calendar View</button>
          <button className={`btn btn-outline-success ${activeTab === "Notifications" ? "active" : ""}`} onClick={() => setActiveTab("Notifications")}>Notifications</button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mt-4">
        {activeTab === "Overview" && (
          <div className="card shadow p-4 mb-5 bg-success-subtle border border-success-subtle rounded-3">
            <Overview patientId={assignedPatientId}
                      patientName={patientName}
                      patientGender={patientGender}
 />
          </div>
        )}
        {activeTab === "RecentActivity" && (
          <div className="card shadow p-4 mb-4 bg-success-subtle">
            <RecentActivity patientId={assignedPatientId}/>
          </div>
        )}
        {activeTab === "CalendarView" && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="card shadow p-4 mb-4 text-center">
              <CalendarView patientId={assignedPatientId} />
            </div>
          </div>
        )}
        {activeTab === "Notifications" && (
          <div className="card shadow p-4 mb-4 bg-success-subtle border border-success-subtle rounded-3">
            <Notification patientName={patientName} patientGender={patientGender} adherenceRate={adherenceRate} streak={currentStreak}  medications={medications} />
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Footer />
      </div>
    </>
  );
}

export default CaretakerView;
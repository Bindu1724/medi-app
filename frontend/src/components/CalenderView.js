import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "react-calendar/dist/Calendar.css"; // default styles


function CalendarView({ patientId }) {
  const [date, setDate] = useState(new Date());
  const [medications, setMedications] = useState([]);
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        if (!patientId) return;
        const res = await axios.get(
          `https://medi-app-1ujt.onrender.com/api/medications?userId=${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMedications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch medications", err);
      }
    };
    fetchMeds();
  }, [patientId, token]);

  // Convert selected date to YYYY-MM-DD string
  const selectedDate = date.toLocaleDateString("en-CA"); 
  const medsForSelectedDate = medications.filter(
    (med) => new Date(med.date).toLocaleDateString("en-CA") === selectedDate
  );


  const getBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "taken":
        return <span className="badge bg-success"><FaCheckCircle className="me-1" /> Taken</span>;
      case "missed":
        return <span className="badge bg-danger"><FaTimesCircle className="me-1" /> Missed</span>;
      case "pending":
        return <span className="badge bg-warning text-dark"><FaClock className="me-1" /> Pending</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="container mt-4 ">
      <h2 className="mb-3 text-success">Medication Calendar</h2>
        <Calendar onChange={setDate} value={date} />

      <div className="mt-4  ">
        <h5 className="text-success">Medications for {selectedDate}</h5>
        {medsForSelectedDate.length > 0 ? (
          <div className="card shadow p-3">
            <ul className="list-group">
              {medsForSelectedDate.map((med) => (
                <li
                  key={med._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong className=" fw-bold text-dark">{med.name}</strong>
                    <br />
                    <small className="text-muted">{med.date} {med.time}</small>
                  </div>
                  {getBadge(med.status)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted">No medications scheduled for {selectedDate}.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
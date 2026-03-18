// src/components/RecentActivity.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope } from 'react-icons/fa';

function RecentActivity({patientId}) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!patientId) return; // prevent empty fetch
    const fetchRecentActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/medications/recent-activity/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecentActivity();
  }, [patientId]);

  const getBadge = (type) => {
    switch (type) {
      case 'Taken':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" /> Taken</span>;
      case 'Missed':
        return <span className="badge bg-danger"><FaTimesCircle className="me-1" /> Missed</span>;
      case 'Pending':
        return <span className="badge bg-warning text-dark"><FaClock className="me-1" /> Pending</span>;
      case 'Reminder':
        return <span className="badge bg-info text-dark"><FaEnvelope className="me-1" /> Reminder</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="card shadow p-3 mb-4  ">
      <div className="card-body ">
        <h5 className="card-title text-success mb-3">Recent Activity</h5>
        {activities.length === 0 ? (
           <p className="text-muted">No recent activity yet</p>
        ) : (
        <ul className="list-group">
          {activities.map((act, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{act.name}</strong> — {act.dosage}
                <br />
                <small className="text-muted">{act.time}</small>
              </div>
            {getBadge(act.status)} {/* use status  */}
        </li>
      ))}
    </ul>
  )}
    </div>
</div>
  );
}
export default RecentActivity;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js';
import Register from './pages/Register';
import PatientDashboard from './components/PatientDashboard.js';
import CaretakerDashboard from './components/CaretakerDashboard';
import HomePage from './components/homePage.js';
import Notification from "./components/notification.js";
import CalendarView from "./components/CalenderView.js";
import { useLocation } from "react-router-dom";


function NotificationPage() {
  const location = useLocation();
  const { patientName, patientGender, adherenceRate, streak, medications } = location.state || {};

  return (
    <Notification
      patientName={patientName}
      patientGender={patientGender}
      adherenceRate={adherenceRate}
      streak={streak}
      medications={medications}
    />
  );
}

function CalendarPage() {
  const location = useLocation();
  const { patientId } = location.state || {};

  return (
    <CalendarView patientId={patientId} />
  );
}



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/caretaker/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/login" element={<Login />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />
        <Route path="/caretaker-dashboard/notifications" element={<NotificationPage />} />
        <Route path="/caretaker-dashboard/calendar" element={<CalendarPage />} />

      </Routes>
    </Router>
  );
}

export default App;
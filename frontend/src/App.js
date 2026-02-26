import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MedicationPage from './pages/MedicationPage';
import PatientPage from './pages/PatientPage';
import CaretakerPage from './pages/CaretakerPage';
import OverviewPage from './pages/OverviewPage';
import MonthlyAdherence from './pages/MonthlyAdherence';
import RecentActivity from './pages/RecentActivity';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/medications" element={<MedicationPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/caretaker" element={<CaretakerPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/monthly" element={<MonthlyAdherence />} />
        <Route path="/recent" element={<RecentActivity />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
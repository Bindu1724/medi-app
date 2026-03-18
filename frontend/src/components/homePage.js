// src/components/MedCheck.js
import { FaUser } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleCaretakerClick = () => {
    navigate('/caretaker/login');
  };
  const handlePatientClick = () => {
    navigate('/patient/login');
  };

  return (
    <div className="container text-center mt-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-success fw-bold">Welcome to MediTrack</h1>
        <p className="text-muted">
          Your personal assistant for timely medication reminders.
        </p>
      </div>

      {/* Grid with two roles */}
      <div className="row g-4">
        {/* Patient Card */}
        <div className="col-md-6">
          <div className="card shadow h-100">
            <div className="card-body">
              <div className="text-success mb-3" style={{ fontSize: '2rem' }}>
                <FaUser />
              </div>
              <h2 className="card-title text-success">I'm a Patient</h2>
              <p className="text-muted text-success">
                Gentle reminders for your medication, and a safe space for your health records.
              </p>
              <ul className="list-unstyled text-start">
                <li>✔ Set up medication reminders</li>
                <li>✔ Track your medication intake</li>
                <li>✔ Receive notifications for missed doses</li>
              </ul>
              <button
                onClick={handlePatientClick}
                className="btn btn-success mt-3"
              >
                Continue as Patient
              </button>
            </div>
          </div>
        </div>

        {/* Caretaker Card */}
        <div className="col-md-6">
          <div className="card shadow h-100">
            <div className="card-body">
              <div className="text-success mb-3" style={{ fontSize: '2rem' }}>
                <FaUserDoctor />
              </div>
              <h2 className="card-title text-success">I'm a Caretaker</h2>
              <p className="text-muted text-success">
                Monitor and support your loved one's medication needs.
              </p>
              <ul className="list-unstyled text-start">
                <li>✔ Receive email alerts</li>
                <li>✔ Monitor medication adherence</li>
                <li>✔ View detailed reports</li>
              </ul>
              <button
                onClick={handleCaretakerClick}
                className="btn btn-success mt-3"
              >
                Continue as Caretaker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-muted">
        You can switch roles anytime after setup.
      </p>
    </div>
  );
}

export default HomePage;
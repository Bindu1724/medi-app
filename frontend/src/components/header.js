// src/components/header.js
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current role based on URL
  const isCaretaker = location.pathname.includes('/caretaker');

  const handleSwitch = () => {
    navigate(isCaretaker ? '/patient/login' : '/caretaker/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success bg-opacity-25 border-bottom border-success px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo Section */}
        <div className="d-flex align-items-center gap-2">
          <FaUserCircle className="text-success" style={{ fontSize: '2rem' }} />
          <span className="navbar-brand mb-0 h1 text-success fw-bold">
            MediTrack Companion
          </span>
        </div>

        {/* Switch Button */}
        <button
          className="btn btn-success fw-bold"
          onClick={handleSwitch}
        >
          {isCaretaker ? 'Switch to Patient' : 'Switch to Caretaker'}
        </button>
      </div>
    </nav>
  );
}

export default Header;

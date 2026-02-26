import { Link } from 'react-router-dom';
import '../styles/medication.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/medications">Medications</Link>
      <Link to="/overview">Overview</Link>
    </nav>
  );
}

export default Navbar;
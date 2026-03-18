import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState('patient');
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/users/register", "POST", { name, email, password, gender, role });
      setSuccess('Registration successful — redirecting to sign in...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <form className="card p-4 shadow w-100" style={{ maxWidth: '520px' }} onSubmit={submit}>
        <h2 className="mb-3 text-center">Create an account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="row">
          <div className="mb-3 col-md-6 pe-md-2">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3 col-md-6 ps-md-2">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
        </div>

        <label className="mb-2">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
          </select>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="caretaker">Caretaker</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing up...' : 'Register'}
        </button>

        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/login">Sign in</Link>
          </small>
        </div>
      </form>
    </div>
  );
}

export default Register;

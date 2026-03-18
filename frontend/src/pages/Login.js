import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/userService';
import { loginUser } from '../utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');   // role state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ✅ only pass email + password + role
      const ok = await login(email, password, role);

      // Store token + user info (gender comes from backend response, not login form)
      loginUser({
        token: ok.token,
        role: ok.user.role,
        name: ok.user.name,
        gender: ok.user.gender,   // backend should include this
        userId: ok.user._id
      });

      console.log("login response:", ok);

      // Navigate based on role
      if (ok.user.role === 'caretaker') {
        navigate('/caretaker-dashboard');
      } else if (ok.user.role === 'patient') {
        navigate('/patient-dashboard');
      } else {
        setError('Invalid role');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <form className="card p-4 shadow w-100" style={{ maxWidth: '420px' }} onSubmit={submit}>
        <h2 className="mb-3 text-center">Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="caretaker">Caretaker</option>
          </select>
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="text-center mt-3">
          <small>Don't have an account? <Link to="/register">Register</Link></small>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiMessage(err, 'Login failed'));
    }
  };

  return (
    <section className="auth-shell">
      <article className="auth-showcase reveal">
        <p className="eyebrow">Sign In</p>
        <h1>Welcome back to CentralConnect.</h1>
        <p>
          Sign in to manage your transfer requests, legal support, applications, and saved city information.
        </p>
        <div className="auth-points">
          <div className="auth-point">
            <strong>Everything in one place</strong>
            <span>Keep your requests, updates, and community posts together.</span>
          </div>
          <div className="auth-point">
            <strong>Faster follow-up</strong>
            <span>Check status updates and return to any section at any time.</span>
          </div>
        </div>
      </article>

      <section className="auth-card reveal">
        <h2>Login</h2>
        <p className="auth-caption">Use your email and password to continue.</p>
        <form onSubmit={onSubmit} className="form-grid">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary-btn">Login</button>
        </form>
        <p className="auth-switch">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </section>
    </section>
  );
}

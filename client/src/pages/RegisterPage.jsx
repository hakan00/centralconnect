import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', nationality: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiMessage(err, 'Registration failed'));
    }
  };

  return (
    <section className="auth-shell">
      <article className="auth-showcase reveal">
        <p className="eyebrow">Create Account</p>
        <h1>Start using CentralConnect.</h1>
        <p>
          Create your account to book services, track requests, and keep your information in one place.
        </p>
        <div className="auth-points">
          <div className="auth-point">
            <strong>Simple setup</strong>
            <span>Create your account and start using all main sections right away.</span>
          </div>
          <div className="auth-point">
            <strong>Your information stays together</strong>
            <span>Keep transfers, legal requests, and applications in one place.</span>
          </div>
        </div>
      </article>

      <section className="auth-card reveal">
        <h2>Create Account</h2>
        <p className="auth-caption">Create your account to start using the service.</p>
        <form onSubmit={onSubmit} className="form-grid">
          <label className="field">
            <span>Full name</span>
            <input
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Nationality</span>
            <input
              placeholder="Country of origin"
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </label>
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
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary-btn">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </section>
  );
}

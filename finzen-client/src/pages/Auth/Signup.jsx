import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/api';
import './Auth.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    age: '',
    risk_profile: 'moderate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/signup', {
        ...formData,
        age: parseInt(formData.age),
      });

      // Store token and user data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join FinZen</h1>
        <p className="subtitle">Start your investment journey</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone (10 digits)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="18"
              min="18"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Risk Profile</label>
            <select name="risk_profile" value={formData.risk_profile} onChange={handleChange}>
              <option value="conservative">Conservative - Low Risk</option>
              <option value="moderate">Moderate - Balanced</option>
              <option value="aggressive">Aggressive - High Growth</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

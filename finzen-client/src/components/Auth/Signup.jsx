import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading, error } = useUserStore();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    age: '',
    risk_profile: 'moderate',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age)
      };
      await signup(submitData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Join FinZen</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Start your investment journey today</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c53030', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rahul Kumar"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Phone (10 digits)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength="10"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="28"
              min="18"
              max="100"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Risk Profile</label>
            <select 
              name="risk_profile" 
              value={formData.risk_profile} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
            >
              <option value="conservative">Conservative (Low Risk)</option>
              <option value="moderate">Moderate (Medium Risk)</option>
              <option value="aggressive">Aggressive (High Risk)</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: loading ? '#ccc' : '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
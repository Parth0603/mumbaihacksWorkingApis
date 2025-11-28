import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useUserStore();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Login to your FinZen account</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c53030', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
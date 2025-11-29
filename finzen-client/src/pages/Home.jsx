import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)' 
    }}>
      <section style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 24px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '24px' 
          }}>
            Smart Investing Made Simple
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#4b5563', 
            marginBottom: '32px', 
            maxWidth: '672px', 
            margin: '0 auto 32px' 
          }}>
            Round up your daily spending and invest the spare change automatically. 
            Build wealth while you spend with AI-powered recommendations.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link
              to="/signup"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Start Investing Today
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                border: '2px solid #2563eb'
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
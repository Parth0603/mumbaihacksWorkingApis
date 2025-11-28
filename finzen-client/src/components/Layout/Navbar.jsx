import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>FinZen</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#374151' }}>Welcome, User</span>
          <button
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
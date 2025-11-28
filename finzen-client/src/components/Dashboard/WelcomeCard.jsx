import React from 'react';

const WelcomeCard = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome back! 👋
        </h2>
        <p style={{ color: '#dbeafe' }}>
          You're on track to reach your investment goals. Keep up the great work!
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;
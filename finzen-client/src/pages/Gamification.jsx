import React from 'react';

const Gamification = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Rewards & Achievements</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏅</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>Level 3</h3>
          <p style={{ color: '#6b7280' }}>1,250 points</p>
          <div style={{ marginTop: '16px' }}>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ width: '60%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', height: '8px', borderRadius: '4px' }}></div>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>750 points to Level 4</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Badges</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', border: '2px solid #fbbf24', borderRadius: '8px', backgroundColor: '#fef3c7' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600' }}>First Investor</h4>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', border: '2px solid #f97316', borderRadius: '8px', backgroundColor: '#fed7aa' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔥</div>
              <h4 style={{ fontSize: '14px', fontWeight: '600' }}>5-Day Streak</h4>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Current Streaks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>7</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Daily Opens</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>3</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Weekly Investments</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>5</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Education Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
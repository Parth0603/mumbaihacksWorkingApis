import React from 'react';

const Education = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Education Modules</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '2px solid #10b981'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Stock Market 101</h4>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>Learn the basics of stock market investing</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                <span>Beginner</span>
                <span>2 min</span>
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>✅</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
              <span>Progress</span>
              <span>100%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ width: '100%', backgroundColor: '#10b981', height: '8px', borderRadius: '4px' }}></div>
            </div>
          </div>
          <button style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            width: '100%',
            cursor: 'pointer'
          }}>Completed</button>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Mutual Funds Explained</h4>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>Understanding mutual funds and their benefits</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                <span>Beginner</span>
                <span>2.5 min</span>
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>📚</span>
          </div>
          <button style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            width: '100%',
            cursor: 'pointer'
          }}>Start Learning</button>
        </div>
      </div>
    </div>
  );
};

export default Education;
import React from 'react';

const Portfolio = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Portfolio</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Portfolio Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>₹15,540</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Current Value</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>₹490</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Returns</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>3.26%</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Returns %</p>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Holdings</h3>
        <p style={{ color: '#6b7280' }}>Your investment holdings will appear here</p>
      </div>
    </div>
  );
};

export default Portfolio;
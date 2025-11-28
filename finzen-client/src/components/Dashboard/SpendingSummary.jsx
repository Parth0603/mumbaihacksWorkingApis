import React from 'react';

export default function SpendingSummary() {
  // Mock data
  const spending = {
    daily: 4500,
    monthly: 135000,
    categories: [
      { name: 'Food & Beverage', amount: 27000, percentage: 20 },
      { name: 'Transportation', amount: 22500, percentage: 17 },
      { name: 'Shopping', amount: 31500, percentage: 23 },
      { name: 'Entertainment', amount: 27000, percentage: 20 },
      { name: 'Others', amount: 27000, percentage: 20 },
    ],
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Your Spending</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Daily Average</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3b82f6' }}>₹{spending.daily.toLocaleString()}</span>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>This Month</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>₹{spending.monthly.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>By Category</h3>
        {spending.categories.map((cat, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{cat.name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>₹{cat.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                flex: 1, 
                height: '0.5rem', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '0.25rem',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${cat.percentage}%`, 
                  height: '100%', 
                  backgroundColor: '#3b82f6',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#666', minWidth: '2rem' }}>{cat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
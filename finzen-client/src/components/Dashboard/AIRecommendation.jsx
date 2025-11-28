import React from 'react';

export default function AIRecommendation({ recommendation }) {
  if (!recommendation) {
    return (
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>AI Investment Recommendation</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>{recommendation.rationale}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Monthly Target</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#3b82f6' }}>₹{recommendation.monthly_target?.toLocaleString()}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Via Round-ups</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>₹{recommendation.via_round_ups?.toLocaleString()}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#fef7ff', borderRadius: '0.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Manual Investment</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#8b5cf6' }}>₹{recommendation.manual_investment?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Recommended Allocation</h3>
        {Object.entries(recommendation.portfolio_allocation || {}).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {value.percentage}% (₹{value.amount?.toLocaleString()})
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '0.5rem', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.25rem',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${value.percentage}%`, 
                height: '100%', 
                backgroundColor: key === 'balanced_funds' ? '#3b82f6' : key === 'government_bonds' ? '#10b981' : '#f59e0b',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Suggested Instruments</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {recommendation.suggested_instruments?.map((instrument, idx) => (
            <li key={idx} style={{ 
              padding: '0.5rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '0.25rem', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              • {instrument}
            </li>
          ))}
        </ul>
      </div>

      <button style={{ 
        width: '100%', 
        padding: '0.75rem', 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        border: 'none', 
        borderRadius: '0.5rem', 
        fontWeight: '500',
        cursor: 'pointer'
      }}>
        Invest Now
      </button>
    </div>
  );
}
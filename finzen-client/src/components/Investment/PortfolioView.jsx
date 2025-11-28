import React from 'react';

export default function PortfolioView({ portfolio }) {
  if (!portfolio) {
    return (
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Your Portfolio</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Total Invested</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3b82f6' }}>₹{portfolio.total_invested?.toLocaleString()}</span>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Current Value</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>₹{portfolio.total_current_value?.toLocaleString()}</span>
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          backgroundColor: portfolio.total_returns >= 0 ? '#f0fdf4' : '#fef2f2', 
          borderRadius: '0.5rem' 
        }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Total Returns</span>
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: portfolio.total_returns >= 0 ? '#10b981' : '#ef4444' 
          }}>
            ₹{portfolio.total_returns?.toLocaleString()} ({portfolio.returns_percentage}%)
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Goal Progress</span>
          <span style={{ fontSize: '1rem', fontWeight: '600' }}>{portfolio.progress_percentage}%</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '1rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${Math.min(portfolio.progress_percentage, 100)}%`, 
            height: '100%', 
            backgroundColor: '#10b981',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          ₹{portfolio.total_invested?.toLocaleString()} of ₹{portfolio.investment_goal?.toLocaleString()}
          {portfolio.months_to_goal > 0 && ` (${portfolio.months_to_goal} months to goal)`}
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Portfolio Allocation</h3>
        {Object.entries(portfolio.portfolio_allocation || {}).map(([key, value]) => (
          <div key={key} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem', 
            backgroundColor: '#f8fafc', 
            borderRadius: '0.5rem', 
            marginBottom: '0.5rem' 
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize' }}>
              {key.replace(/_/g, ' ')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{value.percentage}%</span>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>₹{value.value?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
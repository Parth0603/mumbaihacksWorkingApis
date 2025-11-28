import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useInvestmentStore } from '../../store/investmentStore';
import { usePortfolioStore } from '../../store/portfolioStore';

export default function Dashboard() {
  const { user } = useUserStore();
  const { fetchRecommendations, recommendations } = useInvestmentStore();
  const { fetchPortfolioSummary, portfolio } = usePortfolioStore();

  useEffect(() => {
    fetchPortfolioSummary();
    fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#666' }}>Your investment dashboard</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Portfolio Summary */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Portfolio Summary</h3>
          {portfolio ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Invested:</span>
                <span style={{ fontWeight: '600' }}>₹{portfolio.total_invested?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Current Value:</span>
                <span style={{ fontWeight: '600' }}>₹{portfolio.total_current_value?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Returns:</span>
                <span style={{ fontWeight: '600', color: portfolio.total_returns >= 0 ? '#10b981' : '#ef4444' }}>
                  ₹{portfolio.total_returns?.toLocaleString()} ({portfolio.returns_percentage}%)
                </span>
              </div>
            </div>
          ) : (
            <p>Loading portfolio data...</p>
          )}
        </div>

        {/* AI Recommendations */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>AI Recommendations</h3>
          {recommendations ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Target:</span>
                <span style={{ fontWeight: '600' }}>₹{recommendations.monthly_target?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Via Round-ups:</span>
                <span style={{ fontWeight: '600' }}>₹{recommendations.via_round_ups?.toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                {recommendations.rationale}
              </p>
            </div>
          ) : (
            <p>Loading recommendations...</p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{ 
              padding: '0.75rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: 'pointer' 
            }}>
              Start Investing
            </button>
            <button style={{ 
              padding: '0.75rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: 'pointer' 
            }}>
              Setup Round-ups
            </button>
            <button style={{ 
              padding: '0.75rem', 
              backgroundColor: '#8b5cf6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: 'pointer' 
            }}>
              Learn & Earn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
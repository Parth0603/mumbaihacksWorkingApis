import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      // Fetch portfolio summary
      const portfolioRes = await apiClient.get('/portfolio/summary');
      setPortfolio(portfolioRes.data);

      // Fetch gamification profile
      const gamRes = await apiClient.get('/gamification/profile');
      setGamification(gamRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    try {
      const response = await apiClient.post('/gamification/daily-reward');
      alert(response.data.message);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      alert('Already claimed today or error occurred');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="subtitle">Here's your investment overview</p>
        </div>
        <button className="btn-claim-reward" onClick={handleClaimReward}>
          🎁 Claim Daily Reward
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Portfolio Value */}
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Invested</p>
            <h2 className="stat-value">₹{portfolio?.total_invested?.toFixed(2) || '0.00'}</h2>
            <p className="stat-change positive">
              +{portfolio?.total_return_percentage?.toFixed(2) || '0'}% this month
            </p>
          </div>
        </div>

        {/* Current Value */}
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Current Value</p>
            <h2 className="stat-value">₹{portfolio?.current_value?.toFixed(2) || '0.00'}</h2>
            <p className="stat-change">Portfolio growth</p>
          </div>
        </div>

        {/* Level & Points */}
        <div className="stat-card gamification">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <p className="stat-label">Level {gamification?.level || 1}</p>
            <h2 className="stat-value">{gamification?.points || 0} Points</h2>
            <p className="stat-change">{gamification?.points_to_next_level || 0} to next level</p>
          </div>
        </div>

        {/* Streak */}
        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <p className="stat-label">Daily Streak</p>
            <h2 className="stat-value">{gamification?.streak_days || 0} Days</h2>
            <p className="stat-change">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => window.location.href = '/portfolio'}>
            <span className="action-icon">💼</span>
            <span>View Portfolio</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/education'}>
            <span className="action-icon">📚</span>
            <span>Learn Investing</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/gamification'}>
            <span className="action-icon">🎮</span>
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Badges Section */}
      {gamification?.badges && gamification.badges.length > 0 && (
        <div className="badges-section">
          <h3>Your Badges 🏅</h3>
          <div className="badges-grid">
            {gamification.badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <span className="badge-icon">🏅</span>
                <span className="badge-name">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Goal Progress */}
      {user?.investment_goal > 0 && (
        <div className="goal-section">
          <h3>Investment Goal Progress</h3>
          <div className="goal-card">
            <div className="goal-info">
              <p>Goal: ₹{user.investment_goal}</p>
              <p>Current: ₹{portfolio?.total_invested?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    ((portfolio?.total_invested || 0) / user.investment_goal) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="progress-text">
              {Math.min(
                ((portfolio?.total_invested || 0) / user.investment_goal) * 100,
                100
              ).toFixed(1)}
              % Complete
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

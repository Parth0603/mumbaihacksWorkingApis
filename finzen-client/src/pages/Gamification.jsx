import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import './Gamification.css';

export default function Gamification() {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      // Fetch user's gamification profile
      const profileRes = await apiClient.get('/gamification/profile');
      setProfile(profileRes.data);

      // Fetch leaderboard
      const leaderboardRes = await apiClient.get('/gamification/leaderboard?limit=10');
      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    try {
      const response = await apiClient.post('/gamification/daily-reward');
      alert(`${response.data.message}\n+${response.data.points_added} points!`);
      fetchGamificationData(); // Refresh data
    } catch (error) {
      alert('Already claimed today or error occurred');
    }
  };

  const handleUpdateStreak = async () => {
    try {
      const response = await apiClient.post('/gamification/streak');
      alert(response.data.message);
      fetchGamificationData();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  if (loading) {
    return (
      <div className="gamification-container">
        <div className="loading">Loading gamification data...</div>
      </div>
    );
  }

  return (
    <div className="gamification-container">
      {/* Header */}
      <div className="gamification-header">
        <h1>🎮 Gamification Hub</h1>
        <p className="subtitle">Track your progress, earn badges, and compete with others!</p>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-card main-profile">
          <div className="profile-header">
            <div className="level-badge">
              <span className="level-number">{profile?.level || 1}</span>
              <span className="level-text">Level</span>
            </div>
            <div className="profile-info">
              <h2>{JSON.parse(localStorage.getItem('user'))?.name}</h2>
              <p>{profile?.points || 0} Total Points</p>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-info">
              <span>Progress to Level {profile?.next_level || 2}</span>
              <span>{profile?.points_to_next_level || 0} points needed</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${profile?.level_progress_percent || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <div>
                <p className="stat-value">{profile?.streak_days || 0}</p>
                <p className="stat-label">Day Streak</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏅</span>
              <div>
                <p className="stat-value">{profile?.badges?.length || 0}</p>
                <p className="stat-label">Badges</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <div>
                <p className="stat-value">{profile?.total_modules_completed || 0}</p>
                <p className="stat-label">Modules</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💰</span>
              <div>
                <p className="stat-value">{profile?.total_investments || 0}</p>
                <p className="stat-label">Investments</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-reward" onClick={handleClaimReward}>
              🎁 Claim Daily Reward
            </button>
            <button className="btn-streak" onClick={handleUpdateStreak}>
              🔥 Update Streak
            </button>
          </div>
        </div>

        {/* Badges Section */}
        {profile?.badges && profile.badges.length > 0 && (
          <div className="badges-card">
            <h3>🏆 Your Badges</h3>
            <div className="badges-grid">
              {profile.badges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <span className="badge-icon">🏅</span>
                  <span className="badge-name">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="leaderboard-section">
        <h2>🏆 Top Investors</h2>
        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>User</span>
            <span>Points</span>
            <span>Level</span>
            <span>Badges</span>
          </div>
          {leaderboard.map((entry, index) => (
            <div key={index} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
              <span className="rank">
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
              </span>
              <span className="user-name">{entry.user_name}</span>
              <span className="points">{entry.points}</span>
              <span className="level">Level {entry.level}</span>
              <span className="badges">{entry.badges_count} 🏅</span>
            </div>
          ))}
        </div>
      </div>

      {/* Points System Info */}
      <div className="points-info">
        <h3>💎 How to Earn Points</h3>
        <div className="points-grid">
          <div className="point-item">
            <span className="point-icon">💰</span>
            <div>
              <p className="point-value">+10 Points</p>
              <p className="point-label">Create Investment</p>
            </div>
          </div>
          <div className="point-item">
            <span className="point-icon">📚</span>
            <div>
              <p className="point-value">+50 Points</p>
              <p className="point-label">Complete Module</p>
            </div>
          </div>
          <div className="point-item">
            <span className="point-icon">✅</span>
            <div>
              <p className="point-value">+30 Points</p>
              <p className="point-label">Pass Quiz</p>
            </div>
          </div>
          <div className="point-item">
            <span className="point-icon">🎁</span>
            <div>
              <p className="point-value">+5 Points</p>
              <p className="point-label">Daily Login</p>
            </div>
          </div>
          <div className="point-item">
            <span className="point-icon">🎯</span>
            <div>
              <p className="point-value">+25 Points</p>
              <p className="point-label">₹1,000 Milestone</p>
            </div>
          </div>
          <div className="point-item">
            <span className="point-icon">🚀</span>
            <div>
              <p className="point-value">+100 Points</p>
              <p className="point-label">₹5,000 Milestone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

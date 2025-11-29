import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get('/gamification/leaderboard?limit=10');
      setLeaderboard(response.data.leaderboard);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Points</th>
            <th>Level</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => (
            <tr key={idx} className={idx === 0 ? 'top-user' : ''}>
              <td>
                {entry.rank === 1
                  ? '🥇'
                  : entry.rank === 2
                  ? '🥈'
                  : entry.rank === 3
                  ? '🥉'
                  : entry.rank}
              </td>
              <td>{entry.user_name}</td>
              <td className="points">{entry.points}</td>
              <td className="level">Level {entry.level}</td>
              <td className="badges">{entry.badges_count} 🏅</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

export default function GamificationProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/gamification/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch gamification profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <div>
      <h2>Level {profile.level}</h2>
      <p>{profile.points_to_next_level} points to next level</p>
      <div>
        <h3>Total Points</h3>
        <p>{profile.points}</p>
      </div>
      <div>
        <h3>🏆 Badges ({profile.badges.length})</h3>
        {profile.badges.map((badge) => (
          <span key={badge}>{badge}</span>
        ))}
      </div>
      <div>
        <h3>🔥 Current Streak</h3>
        <p>{profile.streak_days} days</p>
      </div>
    </div>
  );
}

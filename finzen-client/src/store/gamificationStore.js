import { create } from 'zustand';
import { gamificationService } from '../services/gamificationService';

const gamificationStore = create((set) => ({
  // State
  badges: [],
  points: 0,
  level: 1,
  leaderboard: [],
  streaks: {},
  loading: false,
  error: null,

  // Actions
  setBadges: (badges) => set({ badges }),
  setPoints: (points) => set({ points }),
  setLevel: (level) => set({ level }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setStreaks: (streaks) => set({ streaks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async actions
  fetchGamificationProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await gamificationService.getProfile();
      set({ 
        badges: profile.badges,
        points: profile.total_points,
        level: profile.current_level,
        streaks: profile.streaks,
        loading: false 
      });
      return profile;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  fetchLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await gamificationService.getLeaderboard();
      set({ 
        leaderboard: response.leaderboard,
        loading: false 
      });
      return response;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  claimDailyReward: async () => {
    set({ loading: true, error: null });
    try {
      const result = await gamificationService.claimDailyReward();
      set({ 
        points: result.new_total,
        loading: false 
      });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  }
}));

export default gamificationStore;
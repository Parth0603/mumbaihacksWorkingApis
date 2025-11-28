import { create } from 'zustand';
import apiClient from '../utils/api';

export const usePortfolioStore = create((set) => ({
  portfolio: null,
  performance: null,
  loading: false,
  error: null,

  setPortfolio: (portfolio) => set({ portfolio }),
  setPerformance: (performance) => set({ performance }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchPortfolioSummary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/portfolio/summary');
      set({ portfolio: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch portfolio';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchPortfolioPerformance: async (period = '1m') => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/portfolio/performance?period=${period}`);
      set({ performance: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch performance';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchAllocation: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/portfolio/allocation');
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch allocation';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
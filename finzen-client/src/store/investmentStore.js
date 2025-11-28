import { create } from 'zustand';
import apiClient from '../utils/api';

export const useInvestmentStore = create((set) => ({
  investments: [],
  recommendations: null,
  roundUpRules: null,
  loading: false,
  error: null,

  setInvestments: (investments) => set({ investments }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setRoundUpRules: (rules) => set({ roundUpRules: rules }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchInvestments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/investments/');
      set({ investments: response.data.investments, loading: false });
      return response.data.investments;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch investments';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchRecommendations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/ai/recommendations');
      set({ recommendations: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch recommendations';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  createInvestment: async (investmentData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/investments/', investmentData);
      set((state) => ({
        investments: [...state.investments, response.data.investment],
        loading: false,
      }));
      return response.data.investment;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create investment';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setRoundUpRulesData: async (rulesData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/investments/roundup-rules', rulesData);
      set({ roundUpRules: response.data.rules, loading: false });
      return response.data.rules;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to set round-up rules';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchRoundUpRules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/investments/roundup-rules');
      set({ roundUpRules: response.data || null, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch round-up rules';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
import { create } from 'zustand';
import apiClient from '../utils/api';

export const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/signup', userData);
      set({
        user: response.data.user,
        token: response.data.access_token,
        isAuthenticated: true,
        loading: false,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      set({
        user: response.data.user,
        token: response.data.access_token,
        isAuthenticated: true,
        loading: false,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  verifyOTP: async (phone, otp) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/verify-otp', { phone, otp });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'OTP verification failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  sendOTP: async (phone) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/send-otp', { phone });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send OTP';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
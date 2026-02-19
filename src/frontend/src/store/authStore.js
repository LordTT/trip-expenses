import { create } from 'zustand';
import { userAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.login({ email, password });
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to login';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.register({ username, email, password });
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to register';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  getUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getProfile();
      set({ user: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to get profile';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;

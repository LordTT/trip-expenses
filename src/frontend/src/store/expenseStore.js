import { create } from 'zustand';
import { expenseAPI } from '../services/api';

const useExpenseStore = create((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  addExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await expenseAPI.add(expenseData);
      set((state) => ({ expenses: [...state.expenses, response.data], isLoading: false }));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to add expense';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  getExpensesByTrip: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await expenseAPI.getByTrip(tripId);
      set({ expenses: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to get expenses';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    set({ isLoading: true, error: null });
    try {
      await expenseAPI.delete(expenseId);
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense._id !== expenseId),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete expense';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearExpenses: () => set({ expenses: [] }),
  clearError: () => set({ error: null }),
}));

export default useExpenseStore;

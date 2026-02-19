import { create } from 'zustand';
import { tripAPI } from '../services/api';

const useTripStore = create((set) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripAPI.create(tripData);
      set((state) => ({ trips: [...state.trips, response.data], isLoading: false }));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create trip';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  getTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripAPI.getAll();
      set({ trips: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to get trips';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  getTripById: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripAPI.getById(tripId);
      set({ currentTrip: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to get trip';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  addTripMember: async (tripId, userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripAPI.addMember(tripId, userId);
      set((state) => ({
        trips: state.trips.map((trip) =>
          trip._id === tripId ? response.data : trip
        ),
        currentTrip: state.currentTrip?._id === tripId ? response.data : state.currentTrip,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to add member';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteTrip: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      await tripAPI.delete(tripId);
      set((state) => ({
        trips: state.trips.filter((trip) => trip._id !== tripId),
        currentTrip: state.currentTrip?._id === tripId ? null : state.currentTrip,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete trip';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearCurrentTrip: () => set({ currentTrip: null }),
  clearError: () => set({ error: null }),
}));

export default useTripStore;

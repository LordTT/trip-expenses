import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User endpoints
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (userData) => api.post('/users/login', userData),
  getProfile: () => api.get('/users/profile'),
  findByEmail: (email) => api.get(`/trips/find-user-by-email?email=${encodeURIComponent(email)}`),
};

// Trip endpoints
export const tripAPI = {
  create: (tripData) => api.post('/trips', tripData),
  getAll: () => api.get('/trips'),
  getById: (tripId) => api.get(`/trips/${tripId}`),
  addMember: (tripId, userId) =>
    api.post(`/trips/${tripId}/members`, { userId }),
  delete: (tripId) => api.delete(`/trips/${tripId}`),
};

// Expense endpoints
export const expenseAPI = {
  add: (expenseData) => api.post('/expenses', expenseData),
  getByTrip: (tripId) => api.get(`/expenses/trip/${tripId}`),
  delete: (expenseId) => api.delete(`/expenses/delete/${expenseId}`),
};

export default api;

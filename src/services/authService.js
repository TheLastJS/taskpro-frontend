import axiosInstance from './axios';

export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/users/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 
import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: localStorage.getItem('isLogged') === 'true' || false,
  }),

  actions: {
    async register(formData) {
      try {
        const res = await axiosPreset.post('/register', formData);
        return res.data;
      } catch (err) {
        throw err.response.data;
      }
    },

    async login(email, password) {
      try {
        const res = await axiosPreset.post('/login', { email, password });

        this.token = res.data.token;
        localStorage.setItem('token', this.token);
        this.isLoggedIn = true;
        localStorage.setItem('isLogged', this.isLoggedIn);

        await this.getUser();
      } catch (err) {
        console.error('Login error:', err);
        this.logout();
        throw err;
      }
    },

    async getUser() {
      try {
        const res = await axiosPreset.get('/user');
        this.user = res.data;
        localStorage.setItem('userData', JSON.stringify(res.data));
      } catch (err) {
        console.error('Get user error:', err);
      }
    },

    async checkTokenExpiry() {
      try {
        const res = await axiosPreset.get('/check-token-expiry');

        if (res.status === 401) {
          this.logout();
          alert('Your session has expired. Please log in again.');
        }

        this.isLoggedIn = true;
        console.log('Token is valid:', this.isLoggedIn);
      } catch (err) {
        console.error('Token expiry check error:', err);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLogged');
      delete axiosPreset.defaults.headers.common['Authorization'];
    },
  },
});

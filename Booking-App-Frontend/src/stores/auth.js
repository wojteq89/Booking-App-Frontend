import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';
import router from '../router';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: localStorage.getItem('isLogged') === 'true' || false,
    status: null,
  }),

  actions: {
    async register(formData) {
      try {
        if (!formData.first_name || !formData.second_name || !formData.email || !formData.password || !formData.city || !formData.phone_number) {
          showAlert({ icon: 'warning', title: 'Wprowadź dane!', })
          return;
        }

        const res = await axiosPreset.post('/register', formData);
        showAlert({ icon: 'success', title: 'Zarejestrowano pomyślnie!', })
        router.push('/login');
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zarejestrować', })
        throw err.response.data;
      }
    },

    async login(email, password) {
      try {
        if (!email || !password) {
          showAlert({ icon: 'warning', title: 'Wprowadź dane!', })
          return;
        }

        const res = await axiosPreset.post('/login', { email, password });
        this.token = res.data.token;
        localStorage.setItem('token', this.token);
        this.isLoggedIn = true;
        localStorage.setItem('isLogged', this.isLoggedIn);
        await this.getUser();
        showAlert({ icon: 'success', title: 'Zalogowano pomyślnie!', })
        router.push('/settings');
      } catch (err) {
        console.error('Login error:', err);
        if (err.response && err.response.status === 403 && err.response.data.status === 'email_not_verified') {
          showAlert({ icon: 'info', title: 'Twoje konto nie jest zweryfikowane. Wysłaliśmy nowy link weryfikacyjny.', })
          router.push('/verify-email');
        } else {
          showAlert({ icon: 'error', title: 'Wprowadź poprawne dane', })
        }
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
          router.push('/settings');
          alert('Your session has expired. Please log in again.');
        }

        this.isLoggedIn = true;
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
      showAlert({ icon: 'success', title: 'Wylogowano pomyślnie!', })
      router.push('/login')
    },

    async forgotPassword(email) {
      try {
        if (!email) {
          showAlert({ icon: 'warning', title: 'Wprowadź email!', })
          return;
        }

        const res = await axiosPreset.post('/forgot-password', { email });
        showAlert({ icon: 'success', title: 'Sprawdź swoją skrzynkę pocztową!', })
        router.push('/login');
        return res.data;
      } catch (err) {
        console.error('Reset password error:', err);
        showAlert({ icon: 'error', title: 'Nie udało się zresetować hasła', })
        throw err.response.data;
      }
    },
  },
});

export const showAlert = ({ icon = 'info', title = '' }) => {
  Swal.fire({
    icon,
    title,
    text: "",
    timer: 2000,
    toast: false,
    showConfirmButton: false,
    timerProgressBar: true,
    background: '#414e66',
    color: '#fff',
  })
}

import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: localStorage.getItem('isLogged') === 'true' || false,
  }),

  actions: {
    async register(formData) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/register', formData)
        return res.data
      } catch (err) {
        throw err.response.data
      }
    },

    async login(email, password) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
        })

        this.token = res.data.token
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        this.isLoggedIn = true
        localStorage.setItem('isLogged', this.isLoggedIn)

        await this.getUser()

      } catch (err) {
        console.error('Login error:', err)
        this.logout()
        throw err
      }
    },

    async getUser() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user')
        this.user = res.data
        localStorage.setItem('userData', JSON.stringify(res.data))
      } catch (err) {
        console.error('Get user error:', err)
      }
    },

    async checkTokenExpiry() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/check-token-expiry', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        if (res.status === 401) {
          this.logout()
          alert('Your session has expired. Please log in again.')
        }

        this.isLoggedIn = true;
        console.log('Token is valid:', this.isLoggedIn)

      } catch (err) {
        console.error('Token expiry check error:', err)
        this.isLoggedIn = false;
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      localStorage.removeItem('isLogged')
      delete axios.defaults.headers.common['Authorization']
    },
  },

})

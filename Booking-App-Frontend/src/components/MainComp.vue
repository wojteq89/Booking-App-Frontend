<template>
    <div v-if="isLoggedIn">
      <h1>Welcome, {{ user ? user.first_name : 'User' }}</h1>
      <button @click="handleLogout()">Logout</button>
    </div>
    <div v-else>
      <h1>Please log in</h1>
      <router-link to="/login">Masz już konto? Zaloguj się</router-link>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth'
  import { defineComponent, onMounted } from 'vue'
  import router from '../router'
  
  export default defineComponent({
    setup() {
      const authStore = useAuthStore()
  
      onMounted(() => {
        if (authStore.token) {
          authStore.checkTokenExpiry()
        }
      })
  
      const handleLogout = () => {
        authStore.logout()
        router.push('/login')
      }
  
      return {
        isLoggedIn: authStore.isLoggedIn,
        authStore,
        user: authStore.user,
        handleLogout,
      }
    },
  })
  </script>
  
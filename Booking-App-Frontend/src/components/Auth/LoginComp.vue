<template>
    <div>
      <h2>Zaloguj się</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Hasło" />
        <button type="submit">Zaloguj</button>
    </form>
    <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
      <div v-if="auth.user">
        <p>Zalogowano jako: {{ auth.user.name }}</p>
        <button @click="auth.logout()">Wyloguj</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import router from '../../router'
  
  const auth = useAuthStore()
  const email = ref('')
  const password = ref('')
  
  const handleLogin = async () => {
    try {
      await auth.login(email.value, password.value)
      router.push('/')
    } catch (err) {
      alert('Niepoprawne dane logowania')
    }
  }
  </script>
  
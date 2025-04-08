<template>
    <form @submit.prevent="submitForm">
      <input v-model="form.first_name" placeholder="First Name" />
      <input v-model="form.second_name" placeholder="Second Name" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.password" type="password" placeholder="Password" />
      <input v-model="form.city" placeholder="City" />
      <input v-model="form.phone_number" placeholder="Phone Number" />
      <select v-model="form.role">
        <option value="user">User</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
    <router-link to="/login">Masz już konto? Zaloguj się</router-link>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  
  const auth = useAuthStore()
  
  const form = reactive({
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    role: 'user',
    city: '',
    phone_number: '',
  })
  
  const submitForm = async () => {
    try {
      await auth.register(form)
      alert('Rejestracja zakończona!')
    } catch (err) {
      alert('Błąd: ' + JSON.stringify(err))
    }
  }
  </script>
  
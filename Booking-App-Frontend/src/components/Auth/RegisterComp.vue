<template>
  <div>
    <div class="login-container" v-if="!auth.user">
      <AppLogo class="app-logo" />
      <h2 class="title">Zarejestruj się</h2>
      <form @submit.prevent="submitForm" class="login-form">
        <input class="input-field" v-model="form.first_name" placeholder="First Name" />
        <input class="input-field" v-model="form.second_name" placeholder="Second Name" />
        <input class="input-field" v-model="form.email" placeholder="Email" />
        <input class="input-field" v-model="form.password" type="password" placeholder="Password" />
        <input class="input-field" v-model="form.city" placeholder="City" />
        <input class="input-field" v-model="form.phone_number" placeholder="Phone Number" />
        <button type="submit" class="submit-button">Register</button>
      </form>
      <router-link to="/login">Masz już konto? Zaloguj się</router-link>
    </div>
    <div v-else="auth.user">
        <p>Zalogowano jako:  {{ auth.user ? auth.user.first_name : 'User' }}</p>
        <button class="submit-button" @click="auth.logout()">Wyloguj</button>
    </div>
  </div>
</template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import router from '../../router'

  const auth = useAuthStore()
  
  const form = reactive({
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    city: '',
    phone_number: '',
  })
  
  const submitForm = async () => {
    try {
      await auth.register(form)
      alert('Rejestracja zakończona!')
      router.push('/login');
    } catch (err) {
      alert('Błąd: ' + JSON.stringify(err))
    }
  }
  </script>
  
<style lang="scss" scoped>
    @use "@/styles/authComponents.scss" as *;
</style>
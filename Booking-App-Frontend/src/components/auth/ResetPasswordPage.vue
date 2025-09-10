<template>
  <div style="margin-top: 150px;">
    <div class="container">
      <AppLogo class="app-logo" />
      <h2 class="title">Resetuj hasło</h2>
      <form @submit.prevent="submitForm" class="custom-form">
        <input class="input-field" v-model="email" placeholder="Email" type="email" required />
        <button type="submit" class="custom-button">Wyślij link resetujący</button>
      </form>
      <router-link to="/login">Masz już konto? Zaloguj się</router-link>
      <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const email = ref('')

const submitForm = async () => {
  await authStore.forgotPassword(email.value)
}
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;
</style>

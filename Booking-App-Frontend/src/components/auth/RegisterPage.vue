<template>
  <div>
    <div class="container" v-if="!authStore.user">
      <AppLogo class="app-logo" />
      <h2 class="title">Zarejestruj się</h2>
      <form @submit.prevent="submitForm" class="custom-form">
        <input class="input-field" v-model="form.first_name" placeholder="Imię" />
        <input class="input-field" v-model="form.second_name" placeholder="Nazwisko" />
        <input class="input-field" v-model="form.email" placeholder="Email" />
        <input class="input-field" v-model="form.password" type="password" placeholder="Hasło" />
        <p>Hasło musi mieć conajmniej 6 znaków</p>
        <input class="input-field" v-model="form.city" placeholder="Miasto" />
        <input class="input-field" v-model="form.phone_number" placeholder="Numer telefonu" />
        <button type="submit" class="custom-button">Register</button>
      </form>
      <router-link to="/login">Masz już konto? Zaloguj się</router-link>
      <router-link to="/reset-password">Nie pamiętam hasła</router-link>
    </div>
    <div v-else="authStore.user">
        <p>Zalogowano jako:  {{ authStore.user ? authStore.user.first_name : 'User' }}</p>
        <button class="custom-button" @click="authStore.logout()">Wyloguj</button>
    </div>
  </div>
</template>
  
<script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  
  const form = reactive({
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    city: '',
    phone_number: '',
  })
  
  const submitForm = async () => {
      await authStore.register(form)
  }
</script>
  
<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
</style>
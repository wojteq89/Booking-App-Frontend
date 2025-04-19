<template>
  <div class="main-container">
    <AppLogo class="app-logo" />
    <div v-if="isLoggedIn">
      <h1>Witaj, {{ user ? user.first_name : 'User' }}</h1>
      <div class="button-container">
        <button class="func-button" @click="goToHomePage()">Przeglądaj</button>
        <button class="func-button" @click="goToBusinessForm()">Dodaj swój biznes</button> <!-- vif jak bedzie mial biznes czyli role=user -->
        <!-- tu przycisk serwisy? role=owner -->
        <button class="func-button" @click="handleLogout()">Wyloguj</button>
      </div>
    </div>
    <div v-else>
      <h1>Zaloguj się ponownie</h1>
      <div class="button-container">
        <button class="func-button" @click="goToLogin()">Zaloguj się ponownie</button>
        <button class="func-button" @click="goToHomePage()">Przeglądaj</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import router from '@/router'

  const authStore = useAuthStore()
  const { isLoggedIn, user } = storeToRefs(authStore)

  const handleLogout = () => {
    authStore.logout()
  }

  const goToLogin = () => {
    router.push('/login')
  }

  const goToHomePage = () => {
    router.push('/home')
  }

  const goToBusinessForm = () => {
    router.push('/add-business-form')
  }
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.func-button {
    background-color: transparent;
    color: $primary;
    border: 2px solid $primary;
    transition: all 0.5s ease-in-out;
    margin-bottom: 10px;
}

.func-button:hover {
    background-color: $primary;
    color: $white;
}
</style>

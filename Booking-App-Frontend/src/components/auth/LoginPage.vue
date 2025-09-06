<template>
    <div style="margin-top: 150px;">
        <div class="container" v-if="!authStore.isLoggedIn">
            <AppLogo class="app-logo" />
            <h2 class="title">Zaloguj się</h2>
            <form @submit.prevent="handleLogin" class="custom-form">
                <input class="input-field" v-model="email" type="email" placeholder="Email" />
                <input class="input-field" v-model="password" type="password" placeholder="Hasło" />
                <button class="custom-button" type="submit" style="margin-top: 15px;">Zaloguj</button>
            </form>
            <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
            <router-link to="/reset-password">Nie pamiętam hasła</router-link>
        </div>
        <div v-if="authStore.isLoggedIn">
            <p>Zalogowano jako:  {{ authStore.user ? authStore.user.first_name : 'User' }}</p>
            <button class="custom-button" @click="authStore.logout()">Wyloguj</button>
        </div>
    </div>
</template>

  
<script setup>
import {
    ref
} from 'vue'
import {
    useAuthStore
} from '@/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    await authStore.login(email.value, password.value)
}
</script>

<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
</style>
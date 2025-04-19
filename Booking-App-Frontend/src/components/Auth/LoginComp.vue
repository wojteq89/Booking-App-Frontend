<template>
    <div>
        <div class="container" v-if="!auth.isLoggedIn">
            <AppLogo class="app-logo" />
            <h2 class="title">Zaloguj się</h2>
            <form @submit.prevent="handleLogin" class="custom-form">
                <input class="input-field" v-model="email" type="email" placeholder="Email" />
                <input class="input-field" v-model="password" type="password" placeholder="Hasło" />
                <button class="custom-button" type="submit">Zaloguj</button>
            </form>
            <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
        </div>
        <div v-if="auth.isLoggedIn">
            <p>Zalogowano jako:  {{ auth.user ? auth.user.first_name : 'User' }}</p>
            <button class="custom-button" @click="auth.logout()">Wyloguj</button>
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

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    await auth.login(email.value, password.value)
}
</script>

<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
</style>
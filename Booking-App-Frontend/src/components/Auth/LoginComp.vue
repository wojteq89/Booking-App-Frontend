<template>
    <div>
        <div class="login-container" v-if="!auth.user">
            <AppLogo class="app-logo" />
            <h2 class="title">Zaloguj się</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <input class="input-field" v-model="email" type="email" placeholder="Email" />
                <input class="input-field" v-model="password" type="password" placeholder="Hasło" />
                <button class="submit-button" type="submit">Zaloguj</button>
            </form>
            <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
        </div>
        <div v-if="auth.user">
            <p>Zalogowano jako:  {{ auth.user ? auth.user.first_name : 'User' }}</p>
            <button class="submit-button" @click="auth.logout()">Wyloguj</button>
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

<style lang="scss" scoped>
    @use "@/styles/authComponents.scss" as *;
</style>
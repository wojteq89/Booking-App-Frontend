<template>
<div class="login-container">
    <AppLogo class="app-logo" />
    <h2 class="title">Zaloguj się</h2>
    <form @submit.prevent="handleLogin" class="login-form">
        <input class="input-field" v-model="email" type="email" placeholder="Email" />
        <input class="input-field" v-model="password" type="password" placeholder="Hasło" />
        <button class="submit-button" type="submit">Zaloguj</button>
    </form>
    <router-link to="/register">Nie masz konta? Zarejestruj się</router-link>
    <div v-if="auth.user">
        <p>Zalogowano jako: {{ auth.user.name }}</p>
        <button @click="auth.logout()">Wyloguj</button>
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
import AppLogo from '../common/AppLogo.vue'

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
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px 2px $shadow;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.title {
    font-size: 30px;
    color: $primary;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 20px;
}

.input-field {
    font-size: large;
    padding: 10px;
    border: 2px solid transparent;
    border-bottom: 2px solid $primary;
    transition: all 0.5s ease-in-out;
    background-color: $white;
    color: $primary;
    font-family: 'Poppins', sans-serif;

}

.input-field:focus {
    outline: none;
    border: 2px solid $primary;
    border-radius: 10px;
}

.input-field:hover {
    border: 2px solid $primary;
    border-radius: 10px;
}

.input-field::placeholder {
    color: $primary;
}

.submit-button {
    background-color: transparent;
    color: $primary;
    border: 2px solid $primary;
    transition: all 0.5s ease-in-out;
    margin-bottom: 10px;
    
}

.submit-button:hover {
    background-color: $primary;
    color: $white;
}

.app-logo {
    transform: scale(0.7);
    margin-bottom: -20px;
}
</style>

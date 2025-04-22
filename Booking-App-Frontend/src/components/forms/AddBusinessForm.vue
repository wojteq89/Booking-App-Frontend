<template>
    <div>
        <div class="container" v-if="authStore.user.role == 'user'">
            <AppLogo class="app-logo" />
            <h2 class="title">Dodaj swój biznes</h2>
            <form @submit.prevent="registerBusiness" class="custom-form">
                <input class="input-field" v-model="form.name" placeholder="Dodaj nazwę biznesu" />
                <input class="input-field" v-model="form.category" placeholder="Wybierz kategorię" />
                <input class="input-field" v-model="form.location" placeholder="Dodaj adres" />
                <input class="input-field" v-model="form.description" placeholder="Dodaj opis" />
                <!-- Dodać godziny otwarcia i zdjęcia -->
                <button class="custom-button" type="submit">Dodaj biznes</button>
            </form>
        </div>
        <div v-if="authStore.user.role == 'owner'">
            <p>Zalogowano jako:  {{ authStore.user ? authStore.user.first_name : 'User' }}</p>
            <button class="custom-button" @click="authStore.logout()">Wyloguj</button>
        </div>
    </div>
</template>

  
<script setup>
import {
    ref,reactive
} from 'vue'
import {
    useAuthStore
} from '@/stores/auth'
import {
    useBusinessStore
} from '@/stores/business'

const authStore = useAuthStore()
const business = useBusinessStore()

const form = reactive({
    name: '',
    category: '',
    location: '',
    description: ''
})

const registerBusiness = async () => {
      await business.registerBusiness(form)
  }
</script>

<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
</style>
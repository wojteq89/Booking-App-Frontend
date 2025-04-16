<template>
<div :class="['navbar', { 'scrolled': isScrolled }]">
    <AppLogo class="app-logo" />
    <button class="profile-button" @click="goToLogin()">{{ user ? user.first_name : 'Zaloguj się' }}</button>
</div>
</template>

<script>
import {
    useAuthStore
} from '@/stores/auth'
import {
    defineComponent,
    ref,
    onMounted,
    onBeforeUnmount,
} from 'vue'
import router from '../../router'
import {
    storeToRefs
} from 'pinia'

export default defineComponent({
    setup() {
        const authStore = useAuthStore()
        const isScrolled = ref(false)
        const {
            user
        } = storeToRefs(authStore)

        const handleScroll = () => {
            isScrolled.value = window.scrollY > 20
        }

        const handleLogout = () => {
            authStore.logout()
            router.push('/login')
        }

        function goToLogin() {
            router.push('/login')
        }

        function goToHomePage() {
            router.push('/home')
        }

        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
        })

        return {
            isLoggedIn: authStore.isLoggedIn,
            authStore,
            user,
            handleLogout,
            goToLogin,
            goToHomePage,
            isScrolled,
        }
    },
})
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    flex-direction: row;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: $white;
    z-index: 999;
    transition: all 0.5s ease-in-out;
    background-color: $white;
}

.navbar.scrolled {
    width: 80%;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 5px 10px 1px $shadow;
    border-radius: 20px;
}

.app-logo {
    transform: scale(0.5);
    margin-left: -60px;
}

.profile-button {
    background-color: transparent;
    color: $primary;
    border: 2px solid $primary;
    margin-left: auto;
    margin-right: 15px;
    transition: all 0.5s ease-in-out;
}

.profile-button:hover {
    background-color: $primary;
    color: $white;
}
</style>

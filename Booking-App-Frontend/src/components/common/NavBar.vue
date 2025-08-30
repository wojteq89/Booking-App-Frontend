<template>
    <div :class="['navbar', { 'scrolled': isScrolled }]">
        <AppLogo class="app-logo" />
        <button class="navbar-button" @click="goToHome()">Home</button>
        <button class="navbar-button" @click="goToOffers()">Oferty</button>
        <button v-if="!isLoggedIn" class="profile-button" @click="goToLogin()">Zaloguj się</button>
        <button v-if="isLoggedIn" class="profile-button" @click="goToSettingsPage()">{{ user.first_name }}</button>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

export default defineComponent({
    setup() {
        const authStore = useAuthStore()
        const { user, isLoggedIn } = storeToRefs(authStore)
        const isScrolled = ref(false)
        const router = useRouter()

        const handleScroll = () => {
            isScrolled.value = window.scrollY > 20
        }

        const handleLogout = () => {
            authStore.logout()
        }

        function goToLogin() {
            router.push('/login')
        }

        function goToHome() {
            router.push('/')
        }

        const goToOffers = () => {
            router.push('/browse-page');
        };

        function goToSettingsPage() {
            router.push('/settings')
        }

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        return {
            isLoggedIn,
            authStore,
            user,
            handleLogout,
            goToLogin,
            goToSettingsPage,
            goToHome,
            goToOffers,
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
    z-index: 50;
    transition: all 0.5s ease-in-out;
    background-color: $white;
}

.navbar.scrolled {
    width: 85%;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
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
    outline: none;
    transition: all 0.5s ease-in-out;
}

.profile-button:hover {
    background-color: $primary;
    color: $white;
}

.navbar-button {
    background-color: transparent;
    color: $primary;
    margin-left: 0;
    margin-right: 15px;
    outline: none;
    border: none;
    position: relative; // ważne, żeby ::after miał punkt odniesienia
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -3px; // odsuwa linię od tekstu
        width: 0;
        height: 3px;
        background-color: $primary;
        transition: width 0.3s ease-in-out;
    }

    &:hover {
        background-color: transparent; // zostaje bez tła
        color: $primary;

        &::after {
            width: 100%;
        }
    }
}

@media screen and (max-width: 768px) {
    .navbar.scrolled {
        width: 95%;
    }

}
</style>

<template>
    <div :class="['navbar', { 'scrolled': isScrolled }]">
        <AppLogo v-if="!isMobile" class="app-logo" @click="goToHome()" />

        <button class="hamburger-menu" @click="toggleMenu">
            <i v-if="!isMenuOpen" class="fas fa-bars"></i>
            <i v-else class="fas fa-times"></i>
        </button>

        <div v-if="!isMobile" class="navbar-links">
            <button class="navbar-button" @click="goToHome()">Home</button>
            <button class="navbar-button" @click="goToOffers()">Oferty</button>
            <button v-if="!isLoggedIn" class="profile-button" @click="goToLogin()">Zaloguj się</button>
            <button v-if="isLoggedIn" class="profile-button" @click="goToSettingsPage()">{{ user.first_name }}</button>
        </div>

        <div v-if="isMobile" :class="['mobile-menu', { 'open': isMenuOpen }]">
            <AppLogo class="app-logo" @click="goToHome()" />
            <button class="navbar-button" @click="goToHome()">Home</button>
            <button class="navbar-button" @click="goToOffers()">Oferty</button>
            <button v-if="!isLoggedIn" class="profile-button" @click="goToLogin()">Zaloguj się</button>
            <button v-if="isLoggedIn" class="profile-button" @click="goToSettingsPage()">{{ user.first_name }}</button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'


export default defineComponent({
    setup() {
        const authStore = useAuthStore()
        const { user, isLoggedIn } = storeToRefs(authStore)
        const isScrolled = ref(false)
        const isMenuOpen = ref(false)
        const router = useRouter()
        const route = useRoute()
        const isMobile = ref(false)

        const checkScreenSize = () => {
            isMobile.value = window.innerWidth < 768
        }

        const handleScroll = () => {
            isScrolled.value = window.scrollY > 20
        }

        watch(() => route.path, () => {
            isMenuOpen.value = false;
        });

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value
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
            window.addEventListener('resize', checkScreenSize)
            checkScreenSize()
        })

        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', checkScreenSize)
        })

        return {
            isLoggedIn,
            user,
            goToLogin,
            goToSettingsPage,
            goToHome,
            goToOffers,
            isScrolled,
            isMenuOpen,
            toggleMenu,
            isMobile,
        }
    },
})
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 70px;
    padding: 0 20px;
    background-color: $white;
    z-index: 50;
    transition: all 0.5s ease-in-out;
    box-sizing: border-box;
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
    margin-left: -70px;
    cursor: pointer;
    z-index: 10;

    @media (max-width: 768px) {
        transform: scale(1);
        margin-left: 0;
    }
}

.navbar-links {
    display: flex;
    align-items: center;
    gap: 15px;
}

.profile-button {
    background-color: transparent;
    color: $primary;
    border: 2px solid $primary;
    outline: none;
    transition: all 0.5s ease-in-out;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
}

.profile-button:hover {
    background-color: $primary;
    color: $white;
}

.navbar-button {
    background-color: transparent;
    color: $primary;
    outline: none;
    border: none;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    padding: 5px;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -3px;
        width: 0;
        height: 3px;
        background-color: $primary;
        transition: width 0.3s ease-in-out;
    }

    &:hover {
        background-color: transparent;
        color: $primary;

        &::after {
            width: 100%;
        }
    }
}

.hamburger-menu {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 60;

    i {
        font-size: 24px;
        color: $primary;
    }
}

.mobile-menu {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background-color: $white;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.4s ease-in-out, visibility 0.4s ease-in-out;

    &.open {
        transform: translateX(0);
        visibility: visible;
    }

    .navbar-button,
    .profile-button {
        font-size: 1.2rem;
    }
}


@media screen and (max-width: 768px) {
    .navbar {
        justify-content: flex-end;
    }

    .navbar.scrolled {
        width: 100%;
        left: 0%;
        top: 0px;
        transform: translateX(0);
        box-shadow: 0px 5px 10px 1px $shadow;
        border-radius: 0px;
    }

    .hamburger-menu {
        display: block;
    }
}
</style>
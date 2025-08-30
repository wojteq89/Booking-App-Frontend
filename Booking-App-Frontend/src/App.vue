<template>
    <NavBar />
    <div class="router-view-container">
        <router-view v-slot="{ Component }">
            <Transition name="slide" mode="out-in">
                <component :is="Component" />
            </Transition>
        </router-view>
    </div>
    <Footer />
</template>

<script>
import {
    useAuthStore
} from '@/stores/auth'
import {
    defineComponent,
    onMounted
} from 'vue'
import NavBar from './components/common/NavBar.vue';
import Footer from './components/common/Footer.vue';

export default defineComponent({
    components: {
        NavBar,
        Footer
    },
    setup() {
        const authStore = useAuthStore()

        onMounted(() => {
            if (authStore.token) {
                authStore.checkTokenExpiry()
                authStore.getUser()
            }
        })

        return {
            authStore,
        }
    },
})
</script>

<style lang="scss">
body {
    background-color: white;
    color: $primary;
    font-family: 'Poppins', sans-serif;
}

#app {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;
}

.router-view-container {
    flex: 1 0 auto;
    margin: 0 auto;
    max-width: 1280px;
    min-height: 100vh;
    margin-top: 60px;
    background-color: $white;
    animation: slideInView 1s ease-out forwards;
    display: flex;
    justify-content: center;
    /* align-items: center;  usuń jeśli nie chcesz centrować pionowo */
}

/* Animations */

@keyframes slideInView {
    0% {
        transform: translateX(-200%);
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all 1s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.slide-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>

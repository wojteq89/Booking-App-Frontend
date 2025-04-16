<template>
<NavBar />
<div class="router-view-container">
    <router-view v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
            <component :is="Component" />
        </Transition>
    </router-view>
</div>
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

export default defineComponent({
    components: {
        NavBar
    },
    setup() {
        const authStore = useAuthStore()

        onMounted(() => {
            if (authStore.token) {
                authStore.checkTokenExpiry()
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
    margin: 0 auto;
    padding: 0;
}

.router-view-container {
    margin-top: 60px;
    background-color: $white;
    animation: slideInView 1s ease-out forwards;
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

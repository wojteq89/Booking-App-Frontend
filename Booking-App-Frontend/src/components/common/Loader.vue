<template>
    <div v-if="businessStore.isLoading" class="preloader">
        <div class="line-scale">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
            <div class="line line-4"></div>
            <div class="line line-5"></div>
        </div>
    </div>
</template>

<script setup>
import { useBusinessStore } from '@/stores/business';

const businessStore = useBusinessStore();
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.preloader {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $white; 
    display: flex;
    justify-content: center; 
    align-items: center; 
    z-index: 9999;

    .line-scale {
        display: flex;
        gap: 4px;
    }

    .line {
        width: 8px;
        height: 65px;
        border-radius: 2px;
        background-color: $primary;
        animation: line-scale-animation 1s infinite cubic-bezier(.2, .68, .18, 1.08);
        animation-fill-mode: both;
    }

    .line-1 {
        animation-delay: 0.1s;
    }

    .line-2 {
        animation-delay: 0.2s;
    }

    .line-3 {
        animation-delay: 0.3s;
    }

    .line-4 {
        animation-delay: 0.4s;
    }

    .line-5 {
        animation-delay: 0.5s;
    }

    @keyframes line-scale-animation {
        0% {
            transform: scaleY(1);
        }

        50% {
            transform: scaleY(0.4);
        }

        100% {
            transform: scaleY(1);
        }
    }
}
</style>
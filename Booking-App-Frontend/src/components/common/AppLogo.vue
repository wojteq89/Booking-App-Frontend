<template>
    <div class="main" @click="goToHome()">
        <img class="callendar-icon" src="../../assets/Graphics/logo_callendar_TermiNow.svg" alt="logo">
        <div class="inscription-container">
            <img class="inscription" src="../../assets/Graphics/logo_inscription_TermiNow.svg" alt="logo">
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const goToHome = () => {
    const router = useRouter();
    router.push('/');
};
</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    position: relative;
    border: 0px solid transparent;
    border-radius: 20px;
}

.callendar-icon {
    z-index: 2;
    position: relative;
}

.inscription {
    z-index: 1;

}

.inscription-container {
    overflow: hidden;
}

@media screen and (width <= 768px) {
    .main {
        flex-direction: column;
    }
    .callendar-icon {
        animation: slideInCallendarMobile 1.5s ease-out forwards;
    }
    .inscription {
        animation: slideInInscriptionMobile 2s ease-out forwards;
    }
}

@media screen and (width > 768px) {
    .callendar-icon {
        animation: slideInCallendar 1.5s ease-out forwards;
    }
    .inscription {
        animation: slideInInscription 1.5s ease-out forwards;
    }
    
}

/* Animations */

@keyframes slideInInscription {
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

@keyframes slideInInscriptionMobile {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes slideInCallendar {
    0% {
        transform: translateX(120%) translateY(0);
    }
    10% {
        transform: translateX(120%) translateY(-30%);
    }
    20% {
        transform: translateX(120%) translateY(0);
    }
    30% {
        transform: translateX(120%) translateY(-15%);
    }
    40% {
        transform: translateX(120%) translateY(0);
    }
    100% {
        transform: translateX(0) translateY(0);
    }
}

@keyframes slideInCallendarMobile {
    0% {
        transform: translateY(-30%);
    }
    10% {
        transform: translateY(0);
    }
    20% {
        transform: translateY(10%);
    }
    30% {
        transform: translateY(-10%);
    }
    40% {
        transform: translateY(-20%);
    }
    50% {
        transform: translateY(-20%);
    }
    100% {
        transform: translateY(0);
    }
}
</style>
<template>
    <div class="main">
        <img class="callendar-icon" src="C:\Users\wojte\Desktop\abns\Praca inżynierska\Booking-App-Frontend\Booking-App-Frontend\src\assets\Graphics\logo_callendar_TermiNow.svg" alt="logo">
        <div class="inscription-container">
            <img class="inscription" src="C:\Users\wojte\Desktop\abns\Praca inżynierska\Booking-App-Frontend\Booking-App-Frontend\src\assets\Graphics\logo_inscription_TermiNow.svg" alt="logo">
        </div>
    </div>
</template>

<script scoped>

</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    position: relative;
    background-color: white;
    border: 0px solid transparent;
    border-radius: 20px;
}

.callendar-icon {
    z-index: 2;
    position: relative;
    animation: slideInCallendar 1.5s ease-out forwards;
}

.inscription {
    animation: slideInInscription 1.5s ease-out forwards;
    z-index: 1;

}

.inscription-container {
    overflow: hidden;
}

@media screen and (max-width: 768px) {
    .main {
        flex-direction: column;
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

</style>
<template>
    <div style="margin-top: 150px;">
        <div class="container">
            <h2 class="title">Zweryfikuj swój adres e-mail</h2>
            <p class="text-center">
                Dziękujemy za rejestrację! Aby kontynuować, musisz zweryfikować swój adres e-mail.
                Sprawdź swoją skrzynkę odbiorczą i kliknij w link, który do Ciebie wysłaliśmy i spróbuj zalogować się ponownie.
            </p>
            <button class="custom-button" @click="goToLogin"> Wróć do logowania </button>
        </div>
    </div>
</template>

<script setup>
import router from '../../router';

const goToLogin = async () => {
    router.push('/login')
}

</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.title {
    margin-bottom: 20px;
}

.text-center {
    width: 80%;
    text-align: center;
}

.mt-4 {
    margin-top: 1rem;
}

a {
    color: $primary;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}
</style>
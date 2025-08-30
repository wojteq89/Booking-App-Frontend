<template>
    <div class="service-item-card">
        <div class="image-section">
            <img src="@/assets/Graphics/ocw3a3ngdun51.webp" alt="Service Image" class="service-image" />
        </div>
        <div class="info-section">
            <h3 class="service-title">12345</h3>
            <p class="service-description">Opis usługi</p>
            <p class="service-price">From 255435</p>
            <button class="book-now-button">Book Now</button>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.service-item-card {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0px 0px 15px $shadow;

    .image-section {
        flex: 1;
        min-width: 150px;

        .service-image {
            max-width: 300px;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>

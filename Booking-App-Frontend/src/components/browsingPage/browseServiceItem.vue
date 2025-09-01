<template>
    <div class="service-item-card">
        <div class="image-section">
            <img :src="business.images && JSON.parse(business.images).length > 0
                ? `http://127.0.0.1:8000${JSON.parse(business.images)[0]}`
                : defaultImage" :alt="business.name" class="service-image" />
        </div>
        <div class="info-section">
            <h3 class="service-title">{{ business.name }}</h3>
            <p class="service-description">{{ business.description }}</p>
            <p class="service-price">Kategoria: {{ business.category }}</p>
            <button class="book-now-button">Book Now</button>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import defaultImage from '@/assets/Graphics/image_placeholder.png';

const props = defineProps({
    business: {
        type: Object,
        required: true,
    },
});
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
        
        .service-image {
            width: 250px;
            height: 175px;
            object-fit: cover;
        }
    }
}
</style>

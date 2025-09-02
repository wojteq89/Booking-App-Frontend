<template>
    <div class="service-item-card">
        <div class="image-section">
            <img :src="business.images && JSON.parse(business.images).length > 0
                ? `http://127.0.0.1:8000${JSON.parse(business.images)[0]}`
                : defaultImage" :alt="business.name" class="service-image" />
        </div>
        <div class="info-section">
            <h3 class="service-title">{{ business.name }}</h3>
            <p class="service-price">Kategoria: {{ businessStore.categories[business.category_id].name }}</p>
            <p class="service-description">{{ shortDescription }}</p>
        </div>
        <button class="custom-button details-button" @click="goToDetails()">Zobacz szczegóły</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import defaultImage from '@/assets/Graphics/image_placeholder.png';
import router from '../../router';
import { useBusinessStore } from '../../stores/business';
import { computed } from 'vue';

const businessStore = useBusinessStore();
const max_length = 50;

const props = defineProps({
    business: {
        type: Object,
        required: true,
    },
});

const shortDescription = computed(() => {
    const description = props.business.description || '';
    if (description.length > max_length) {
        return description.substring(0, max_length) + '...';
    }
    return description;
});

const goToDetails = () => {
    router.push({ name: 'business-details', params: { id: props.business.id } });
};

</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.service-item-card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    width: 250px;
    height: 370px;
    box-shadow: 0px 0px 15px $shadow;

    .image-section {

        .service-image {
            width: 100%;
            height: 175px;
            object-fit: cover;
        }
    }

    .info-section {
        padding: 0px 10px;
    }

    .details-button {
        margin-top: auto;
        width: 80%;
        margin-bottom: 10px;
    }

    h3 {
        margin: 0;
    }

    p {
        margin: 5px 0;
    }
}
</style>

<template>
    <div class="business-card">
        <div class="card-image-section">
            <img :src="appointment.service.images && JSON.parse(appointment.service.images).length > 0
                ? `http://127.0.0.1:8000${JSON.parse(appointment.service.images)[0]}`
                : defaultImage" :alt="appointment.service.name" class="business-image" />
            <div class="image-overlay"></div>
            <div class="category-tag">
                {{ businessStore.categories[appointment.service.category_id]?.name || 'Inne' }}
            </div>
        </div>

        <div class="card-content">
            <h3 class="business-title">{{ appointment.service.name }}</h3>

            <div class="business-meta">
                <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ appointment.service.location || 'Brak lokalizacji' }}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>{{ formatDate(appointment.start) }} – {{ formatDate(appointment.end) }}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-info-circle"></i>
                    <span>Status: {{ appointment.status }}</span>
                </div>
            </div>

            <p class="business-description">{{ shortDescription }}</p>

            <div class="card-actions">
                <button class="primary-button" @click="goToDetails(appointment.service.id)">
                    <i class="fas fa-eye"></i>
                    Zobacz szczegóły
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import defaultImage from '@/assets/Graphics/image_placeholder.png';
import router from '../../router';
import { useBusinessStore } from '../../stores/business';

const businessStore = useBusinessStore();
const max_length = 80;

const props = defineProps({
    appointment: {
        type: Object,
        required: true,
    },
});

const shortDescription = computed(() => {
    const description = props.appointment.service.description || '';
    if (description.length > max_length) {
        return description.substring(0, max_length) + '...';
    }
    return description;
});

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
};

const goToDetails = (id) => {
    router.push(`/business/${id}`);
};
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.business-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
    width: 100%;
    max-width: 220px;
    height: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: #fff;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

        .business-image {
            transform: scale(1.03);
        }

        .primary-button {
            background: $primary;
        }
    }
}

.card-image-section {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;

    .business-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.3) 100%);
    }
}

.category-tag {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(255, 255, 255, 0.85);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    color: $primary;
}

.card-content {
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.business-title {
    margin: 0 0 6px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.2;
}

.business-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;

    .meta-item {
        display: flex;
        align-items: center;
        font-size: 0.7rem;
        color: #6c757d;

        i {
            margin-right: 4px;
            color: $primary;
            font-size: 0.8rem;
        }
    }
}

.business-description {
    margin: 0 0 10px 0;
    color: #555;
    line-height: 1.3;
    font-size: 0.8rem;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-actions {
    margin-top: auto;

    .primary-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        width: 100%;
        padding: 6px 10px;
        background: $primary;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
    }
}

@media (max-width: 650px) {
    .business-card {
        max-width: 180px;
        height: auto;
    }

    .card-image-section {
        height: 120px;
    }

    .business-title {
        font-size: 0.95rem;
    }

    .business-description {
        font-size: 0.75rem;
    }

    .card-actions .primary-button {
        font-size: 0.75rem;
        padding: 5px 8px;
    }
}
</style>

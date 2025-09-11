<template>
  <div class="business-card">
    <div class="card-image-section">
      <template v-if="images.length">
        <img :src="`http://127.0.0.1:8000${images[0]}`" :alt="business.name" class="business-image" />
      </template>
      <div v-else class="no-image">
        <i class="fas fa-image"></i>
        <p>Brak zdjęcia</p>
      </div>

      <div class="image-overlay"></div>
      <div class="category-tag">{{ businessStore.categories[(business.category_id)- 1]?.name || 'Inne' }}</div>
    </div>

    <div class="card-content">
      <h3 class="business-title">{{ business.name }}</h3>

      <div class="business-meta">
        <div class="meta-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ business.location || 'Brak lokalizacji' }}</span>
        </div>
        <div class="meta-item" v-if="business.rating">
          <i class="fas fa-star"></i>
          <span>{{ business.rating.toFixed(1) }}</span>
        </div>
      </div>

      <p class="business-description">{{ shortDescription }}</p>

      <div class="card-actions">
        <button class="primary-button" @click="goToDetails()">
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
  business: {
    type: Object,
    required: true,
  },
});

const images = computed(() => {
  if (Array.isArray(props.business.images)) return props.business.images;
  try {
    return JSON.parse(props.business.images);
  } catch {
    return [];
  }
});

const shortDescription = computed(() => {
  const description = props.business.description || '';
  return description.length > max_length
    ? description.substring(0, max_length) + '...'
    : description;
});

const goToDetails = () => {
  router.push({ name: 'business-details', params: { id: props.business.id } });
};
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.business-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
  width: 100%;
  max-width: 300px;
  height: 380px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);

    .business-image {
      transform: scale(1.05);
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
    transition: transform 0.5s ease;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #6c757d;

    i {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
    }
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.4) 100%);
  }
}

.category-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: $primary;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.business-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.3;
}

.business-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;

  .meta-item {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: #6c757d;

    i {
      margin-right: 5px;
      color: $primary;
    }
  }
}

.business-description {
  margin: 0 0 15px 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
  flex-grow: 1;
}

.card-actions {
  margin-top: auto;

  .primary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 15px;
    background: $primary;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

@media (max-width: 650px) {
  .business-card {
    max-width: 250px;
    height: auto;
  }

  .card-image-section {
    height: 200px;
  }
}
</style>

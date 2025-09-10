<template>
    <div class="favorite-item">
        <div class="image-container">
            <img class="fav-image" v-if="images.length" :src="`http://127.0.0.1:8000${images[0]}`" alt="Zdjęcie biznesu" />
            <div v-else class="no-image">
                <i class="fas fa-image"></i>
                <p>Brak zdjęcia</p>
            </div>
            <div class="category-badge">{{ favorite.category.name }}</div>
            <button @click="toggleFavorite()" class="heart-button">
                <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"
                    :style="{ color: isFavorite ? '#e74c3c' : '#fff', textShadow: isFavorite ? 'none' : '0 1px 2px rgba(0,0,0,0.3)' }">
                </i>
            </button>
        </div>
        
        <div class="fav-content">
            <div class="fav-info">
                <h3 class="title">{{ favorite.name }}</h3>
                <p class="localization"><i class="fas fa-map-marker-alt"></i> {{ favorite.location }}</p>
                <p class="desc">{{ truncateDescription(favorite.description, 120) }}</p>
            </div>
            
            <div class="action-buttons">
                <button @click="goToDetails()" class="details-button">
                    <i class="fas fa-eye"></i>
                    <span>Zobacz szczegóły</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBusinessStore } from '@/stores/business';
import router from '../../router';

const props = defineProps({
    favorite: {
        type: Object,
        required: true
    }
});
const businessStore = useBusinessStore();

const isFavorite = ref(!!props.favorite.is_favorite);

const images = computed(() => {
    if (Array.isArray(props.favorite.images)) {
        return props.favorite.images;
    }
    try {
        return JSON.parse(props.favorite.images);
    } catch {
        return [];
    }
});

function truncateDescription(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

async function toggleFavorite() {
    const res = await businessStore.toggleFavorite(props.favorite.id);
    isFavorite.value = res.favorited;
}

const goToDetails = () => {
    router.push({ name: 'business-details', params: { id: props.favorite.id } });
};
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.favorite-item {
    display: flex;
    width: 90%;
    max-width: 800px;
    height: auto;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 25px;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    background: #fff;
    position: relative;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        
        .fav-image {
            transform: scale(1.05);
        }
        
        .details-button {
            background: $primary;
        }
    }
}

.image-container {
    position: relative;
    width: 35%;
    min-width: 250px;
    overflow: hidden;
    
    .fav-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .no-image {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
}

.category-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(255, 255, 255, 0.9);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: $primary;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.heart-button {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(0, 0, 0, 0.6);
        transform: scale(1.1);
    }
}

.fav-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 65%;
    padding: 20px;
}

.fav-info {
    .title {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
    }
    
    .localization {
        display: flex;
        align-items: center;
        margin: 0 0 12px 0;
        color: #6c757d;
        font-size: 0.9rem;
        
        i {
            margin-right: 8px;
            color: $primary;
        }
    }
    
    .desc {
        margin: 0;
        color: #555;
        line-height: 1.5;
        font-size: 0.95rem;
    }
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    
    .details-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
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

@media (max-width: 850px) {
    .favorite-item {
        flex-direction: column;
        height: auto;
        max-width: 400px;
        margin: 0 auto 25px;
    }
    
    .image-container {
        width: 100%;
        min-width: auto;
        height: 180px;
    }
    
    .fav-content {
        width: 90%;
        padding: 15px;
    }
    
    .action-buttons {
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
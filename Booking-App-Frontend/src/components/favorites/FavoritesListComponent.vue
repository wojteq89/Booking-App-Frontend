<template>
    <div class="favorite-item">
        <img class="fav-image" v-if="images.length" :src="`http://127.0.0.1:8000${images[0]}`" alt="Zdjęcie biznesu" />
        <div class="fav-info">
            <p class="title"><span>{{ favorite.name }}</span></p>
            <p class="localization"><span></span> {{ favorite.location }}</p>
            <p class="category"><span></span> {{ favorite.category.name }}</p>
            <p class="desc"><span>Opis: </span> {{ favorite.description }}</p>
        </div>
        <div class="buttons">
            <button @click="toggleFavorite()" class="fav-button">
                <span v-if="isFavorite" class="button-text"></span>
                <span v-else class="button-text"></span>
                <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"
                    :style="{ color: isFavorite ? '#e74c3c' : '' }">
                </i>
            </button>
            <button @click="goToDetails()" class="fav-button">
                <span class="button-text"></span>
                <i class="fas fa-eye"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';
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
    width: 70vw;
    height: 20vh;
    overflow: hidden;
    border: 2px solid $primary;
    margin-bottom: 20px;
    transition: all 0.3s ease;

    p {
        margin: 0;
        text-align: left;
    }

    &:hover {
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.267);
        transform: translateY(-5px);
    }
}

.fav-image {
    object-fit: cover;
    box-shadow: 0px 0px 15px $shadow;
    max-width: 250px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.fav-info {
    margin-left: 20px;
    margin-right: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    span {
        font-weight: 600;
    }
}

.title {
    font-size: 1.5rem;
}

.desc {}

.category {}

.localization {}

.buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
}

.fav-button {
    display: flex;
    align-items: center;
    gap: 20px;
    color: $primary;
    padding: 8px 16px;
    background-color: transparent;
    border: none;
    font-size: 22px;
    transition: all 0.3s ease-in-out;
    outline: none;

    i {
        order: 2
    }

    &:hover {
        transform: scale(1.1);
    }
}

.button-text {
    order: 1;
    transform: translateX(-10px);
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

@media (max-width: 850px) {
    .favorite-item {
        width: 90vw;
        height: auto;
        flex-direction: column;
    }

    .favorite-item:hover {
        height: auto;
    }

    .fav-image {
        max-width: 100%;
        max-height: 200px;
        margin-bottom: 10px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    .buttons {
        margin: 20px 0px;
        order: 1;
        flex-direction: row;
        justify-content: flex-start;
    }

    .button-text {
        order: 2;
    }

    .fav-button i {
        order: 1;
    }
}
</style>
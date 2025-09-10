<template>
    <div>
        <div v-if="businessStore.isLoading" class="loading-state">
            <Loader />
        </div>
        <div style="width: 100%; margin-top: 20px;">
            <div class="page-header">
                <h1 class="page-title">Polubione</h1>
                <p class="page-subtitle">Zarządzaj swoimi polubionymi serwisami</p>
            </div>
            <div v-if="myFavorites.length === 0" style="text-align:center; padding: 16px;">Brak polubionych</div>
            <FavoritesListComponent v-for="fav in myFavorites" :key="fav.id" :favorite="fav" v-else />
        </div>
    </div>
</template>

<script setup>
import FavoritesListComponent from './FavoritesListComponent.vue';
import { onMounted, ref } from 'vue';
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';
import Loader from '../common/Loader.vue';

const businessStore = useBusinessStore();
const { favorites: myFavorites } = storeToRefs(businessStore);
const loading = ref(true);

onMounted(async () => {
    try {
        await businessStore.fetchFavorites();
    } catch (err) {
        console.error('Błąd podczas ładowania ulubionych:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;
</style>
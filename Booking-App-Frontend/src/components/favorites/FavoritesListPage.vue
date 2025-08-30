<template>
    <div style="width: 100%; margin-top: 20px;">
        <h2 style="text-align: left;">Ulubione</h2>
        <div v-if="loading">
            <AppLogo class="app-logo" />
        </div>
        <div v-else-if="myFavorites.length === 0" style="text-align:center; padding: 16px;">Brak polubionych</div>
        <FavoritesListComponent v-for="fav in myFavorites" :key="fav.id" :favorite="fav" v-else />
    </div>
</template>

<script setup>
import FavoritesListComponent from './FavoritesListComponent.vue';
import { onMounted, ref } from 'vue';
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';

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
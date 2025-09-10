<template>
  <div>
    <div v-if="businessStore.isLoading" class="loading-state">
      <Loader />
    </div>
    <div v-else class="main-container">
      <section class="search-section">
        <h2>Wyszukaj usługę</h2>
        <p>Przeglądaj dostępne usługi i znajdź to, czego potrzebujesz</p>
        <div class="search-wrapper">
          <input class="search-field" type="text" placeholder="Czego szukasz?" v-model="searchText" />
          <i class="fas fa-search search-icon"></i>
        </div>
      </section>

      <section class="results-section">
        <div v-if="businessStore.businesses.length === 0" class="no-results">
          <p>Brak wyników wyszukiwania.</p>
        </div>
        <BrowseServiceItem v-else v-for="business in businessStore.businesses" :key="business.id"
          :business="business" />
      </section>

      <h2 v-if="authStore.isLoggedIn">Twoje wizyty</h2>
      <section v-if="authStore.isLoggedIn" class="results-section">
        <div v-if="confirmedAppointments.length === 0" class="no-results">
          <p>Brak potwierdzonych wizyt.</p>
        </div>
        <ApointmentsItem v-else v-for="appointment in confirmedAppointments" :key="appointment.id"
          :appointment="appointment" />
      </section>

      <h2 v-if="authStore.isLoggedIn">Twoje ulubione</h2>
      <section v-if="authStore.isLoggedIn" class="results-section">
        <div v-if="businessStore.favorites.length === 0" class="no-results">
          <p>Brak polubionych.</p>
        </div>
        <FavoritesListComponent v-else v-for="fav in businessStore.favorites" :key="fav.id" :favorite="fav" />
      </section>

      <h2 v-if="authStore.isLoggedIn">Oferty w twojej okolicy</h2>
      <section v-if="authStore.isLoggedIn" class="results-section">
        <div v-if="businessStore.nearby.length === 0" class="no-results">
          <p>Brak wyników wyszukiwania.</p>
        </div>
        <BrowseServiceItem v-else v-for="business in businessStore.nearby" :key="business.id" :business="business" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useBusinessStore } from '@/stores/business';
import { useAuthStore } from '@/stores/auth.js';
import BrowseServiceItem from './BrowseServiceItem.vue';
import ApointmentsItem from './ApointmentsItem.vue';
import FavoritesListComponent from '../favorites/FavoritesListComponent.vue';
import Loader from '../common/Loader.vue';

const businessStore = useBusinessStore();
const authStore = useAuthStore();

const searchText = ref('');
let searchTimeout = null;

watch(searchText, (newSearchTerm) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {

    businessStore.fetchAllBusinesses(1, '', newSearchTerm);
  }, 500);
});

const confirmedAppointments = computed(() =>
  businessStore.history.filter(item => item.status === "Potwierdzona")
);

onMounted(async () => {
  await businessStore.fetchCategories();
  await businessStore.fetchAllBusinesses();

  if (authStore.isLoggedIn) {
    await businessStore.fetchFavorites();
    await businessStore.fetchAppointments();
    await businessStore.fetchNearbyBusinesses();
  }
});
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.main-container {
  margin-top: 50px;

  h2 {
    font-size: 2rem;
  }
}

.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 120px;

  h2 {
    margin: 0;
    margin-top: 60px;
  }

  p {
    font-size: 1.2rem;
  }

  .search-field {
    font-size: large;
    padding: 10px;
    width: 100%;
    border: 2px solid $primary;
    border-radius: 20px;
    transition: all 0.5s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.253);
    background-color: $white;
    color: $primary;
    font-family: 'Poppins', sans-serif;

    &:focus {
      outline: none;
    }
  }

  .search-wrapper {
    position: relative;
    width: 60%;
    transition: all 0.5s ease-in-out;

    &:hover {
      transform: translateY(-5%);
    }
  }

  .search-icon {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    color: $primary;
    font-size: 1.2rem;
    pointer-events: none;
  }
}

.results-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;

  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: auto;
  justify-content: flex-start;
  padding: 30px;
  margin-bottom: 60px;

  width: 100%;
  max-width: 98vw;
  box-sizing: border-box;

  >* {
    flex: 0 0 auto;
    min-width: 250px;
  }

}

.results-section::-webkit-scrollbar {
  height: 8px;
}

.results-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.results-section::-webkit-scrollbar-thumb {
  background: $primary;
  border-radius: 4px;
}

.results-section::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.results-section {
  scrollbar-width: thin;
  scrollbar-color: $primary #f1f1f1;
}
</style>
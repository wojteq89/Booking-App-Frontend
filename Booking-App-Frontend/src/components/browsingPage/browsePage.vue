<template>
  <div class="main-container">
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
      <BrowseServiceItem v-else v-for="business in businessStore.businesses" :key="business.id" :business="business" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useBusinessStore } from '@/stores/business';
import BrowseServiceItem from './BrowseServiceItem.vue';

const businessStore = useBusinessStore();

const searchText = ref('');

let searchTimeout = null;

watch(searchText, (newSearchTerm) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    businessStore.fetchAllBusinesses(1, '', newSearchTerm);
  }, 500);
});

onMounted(() => {
  businessStore.fetchAllBusinesses();
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

  p {
    font-size: 1.2rem;
  }

  .search-field {
    font-size: large;
    padding: 10px;
    width: 100%;
    border: 2px solid $primary;
    transition: all 0.5s ease-in-out;
    background-color: $white;
    color: $primary;
    font-family: 'Poppins', sans-serif;

    &:focus {
      outline: none;
      border: 2px solid $primary;
      border-radius: 10px;
    }

    &:hover {
      border: 2px solid $primary;
      border-radius: 10px;
    }
  }

  .search-wrapper {
    position: relative;
    width: 60%;
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
  margin-top: 100px;
}
</style>
<template>
  <div class="main-container">
    <section class="search-section">
      <h2>Wyszukaj usługę</h2>
      <p>Przeglądaj dostępne usługi i znajdź to, czego potrzebujesz</p>
      <div class="search-wrapper">
        <input class="search-field" type="text" placeholder="Czego szukasz?" />
        <i class="fas fa-search search-icon"></i>
      </div>
    </section>

    <section class="results-section">
      <BrowseServiceItem v-for="i in 2" :key="i" />
    </section>
  </div>
</template>

<script setup>
import BrowseServiceItem from './BrowseServiceItem.vue'
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
        width: 100%;
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
    gap: 30px;
    margin-top: 100px;
}
</style>
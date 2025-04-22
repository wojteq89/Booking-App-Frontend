<template>
  <div class="main" v-if="service">
    <section class="first-column">
      <div class="photo-container" :style="backgroundImageStyle"></div>

      <div class="title-container">
        <h1 class="bussines-name">{{ service.name }}</h1>
        <button class="fav-button custom-button">❤️</button>
      </div>

      <p class="localization">{{ service.location }}</p>

      <section class="services">
        <h2>Usługi</h2>
        <!-- To można zastąpić dynamiczną listą usług w przyszłości -->
        <div class="service-item" v-for="i in 3" :key="i">
          <h3>Strzyżenie włosów</h3>
          <div class="service-buy">
            <h3 class="service-price">30zł</h3>
            <h3 class="service-time">30min</h3>
          </div>
          <button class="service-buy-button custom-button">Umów</button>
        </div>
      </section>

      <section class="reviews">
        <!-- Opinie -->
      </section>
    </section>

    <section class="second-column">
      <section><strong>Adres:</strong> {{ service.location }}</section>
      <section><strong>Godziny otwarcia:</strong> {{ service.opening_hours || 'Brak danych' }}</section>
      <section><strong>Opis:</strong> {{ service.description || 'Brak opisu' }}</section>
      <section><strong>Kategoria:</strong> {{ service.category }}</section>

      <section v-if="isOwner" class="owner-panel">
        <strong>Panel właściciela:</strong>
        <button class="custom-button">Edytuj</button>
        <button class="custom-button delete-button" @click="deleteService" >Usuń</button>
      </section>
    </section>
  </div>

  <div v-else>
    <AppLogo class="app-logo" />
  </div>
</template>

  

<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useBusinessStore } from '@/stores/business';
  import { storeToRefs } from 'pinia';
  import App from '../../App.vue';

  const businessStore = useBusinessStore();
  const authStore = useAuthStore();
  const { myService: service } = storeToRefs(businessStore);
  
  const isOwner = ref(false);

  onMounted(async () => {
    try {
      await businessStore.fetchMyService();
      checkIsOwner();
    } catch (err) {
      console.error('Błąd podczas ładowania usługi:', err);
    }
  });

  const deleteService = async () => {
    try {
      await businessStore.deleteMyService();
    } catch (err) {
      console.error('Błąd podczas usuwania usługi:', err);
    }
  };

  const checkIsOwner = () => {
    try {
      isOwner.value = authStore.user.id === businessStore.myService.user_id;
    } catch (err) {
      console.error('Błąd podczas sprawdzania właściciela:', err);
    }
  };
</script>


<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
    .main {
        display: flex;
        justify-content: center;
        flex-direction: row;
        width: 90vw;
        padding: 20px;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .first-column {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-right: 3px solid $primary;
        padding-right: 20px;
    }

    .photo-container {
        width: 100%;
        height: 400px;
        background-image: url('@/assets/Graphics/logo_callendar_TermiNow.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }


    .title-container {
        display: flex;
        width: 100%;
        height: auto;
    }
    
    .bussines-name {
        font-size: 30px;
        font-weight: bold;
        margin-left: 10px;
    }
    
    .fav-button {
        margin-left: auto;
        margin-right: 10px;
    }
    
    .localization {
        font-size: 15px;
        font-weight: italic;
        margin-left: 10px;
        text-align: left;
    }

    .services {
        display: flex;
        flex-direction: column;
        gap: 20px;
        text-align: left;
        margin: 10px;
    }

    .service-item {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid $primary;
    }

    .service-name {

    }
    
    .service-buy {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        gap: 20px;
    }

    .service-price {

    }

    .service-buy-button {
      margin-left: 20px;
    }

    .second-column {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        gap: 100px;
    }

    .owner-panel {
        display: flex;
        flex-direction: column;
    }
</style>
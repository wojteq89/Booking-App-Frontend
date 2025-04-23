<template>
  <div class="main" v-if="service">
    <section class="first-column">
      <div class="photo-container"></div>

      <div class="title-container">
        <h1 class="bussines-name">{{ service.name }}</h1>
        <button class="fav-button custom-button">❤️</button>
      </div>
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

      <section class="map-container">
        <iframe class="map-iframe"
          v-if="service.location"
          :src="mapUrl"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <div class="address">
        <strong>Adres:</strong>
        <p>{{ service.location }}</p>  
      </div>

      <strong>Godziny otwarcia:</strong>
      <div class="open-hours">
        <div>
          <p class="week-day" v-for="(day, index) in ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']" :key="index">
            {{ day }}
          </p>
        </div>
        <div class="day-hours" v-if="service.opening_hours">
            <p class="day-hours" v-for="(line, i) in service.opening_hours.split('\n')" :key="i">
              {{ line }}<br />
            </p>
        </div>
        <div v-else>Brak danych</div>
      </div>

      <div class="description">
        <strong>Opis:</strong>
        <p>{{ service.description || 'Brak opisu' }}</p>
      </div>
      
      <div class="category">
        <strong>Kategoria:</strong>
        <p>{{ service.category }}</p>
      </div>

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

  const mapUrl = computed(() => {
    const query = encodeURIComponent(service.value.location || '');
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAKVGoLBVhgqkyjYTSOW55-q4tu0iDyGfY&q=${query}`;
  });
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
        padding-right: 20px;
        transition: all 0.3s ease-in-out;
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
        flex-wrap: wrap;
        font-size: 15px;
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
//-------------Second Column------------------//
    .second-column {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        padding-right: 10px;
        gap: 20px;
        word-wrap: break-word;
        overflow: hidden;
        background-color: rgb(228, 228, 228);
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
    }

    .map-iframe {
      width: 95%;
      height: 250px;
      margin-top: 10px;
      border: none;
      border-radius: 12px;
      box-shadow: 0px 10px 20px 2px $shadow;
    }
    
    .address {
      border-bottom: 1px solid $primary;

    }

    .open-hours {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 50px;
      flex-wrap: wrap;
      padding-bottom: 20px;
      border-bottom: 1px solid $primary;
    }

    .week-day {
      margin: 0px;
      text-align: left;
    }

    .day-hours{
      margin: 0px;
      text-align: right;
    }
    
    .description {
      word-wrap: break-word;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      padding-bottom: 20px;
      border-bottom: 1px solid $primary;
    }

    
    .category {

    }

    .owner-panel {
        display: flex;
        flex-direction: column;
    }

    @media screen and (max-width: 1000px) {
        .service-buy-button {
            width: 100%;
        }

        .main {
            flex-direction: column;
            padding: 0px;
        }

        .first-column {
            width: 100%;
            border-right: none;
            padding-right: 0px;
        }

        .second-column {
            width: 100%;
            padding-left: 0px;
            background-color: transparent;
        }

        .map-iframe {
          height: 400px;
        }
      
    }
</style>
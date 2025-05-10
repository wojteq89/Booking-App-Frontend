<template>
  <div class="main" v-if="business">
    <section class="first-column">
      <div class="photo-container" v-if="parsedImages.length">
        <button
          class="photo-nav-btn left"
          @click="prevImage"
          :disabled="currentImageIndex === 0">
          &#10094;
        </button>
        <div class="image-slider" :style="sliderStyle">
          <img
            v-for="(image, index) in parsedImages"
            :key="index"
            :src="image"
            class="business-image"
            alt="Zdjęcie usługi"
          />
        </div>
        <button
          class="photo-nav-btn right"
          @click="nextImage"
          :disabled="currentImageIndex === parsedImages.length - 1">
          &#10095;
        </button>
      </div>
      <div class="title-container">
        <h1 class="business-name">{{ business.name }}</h1>
        <div class="business-add">
          <button class="fav-button">
            ❤️
          </button>
        </div>
      </div>
      <section class="services-section">
        <h2 class="section-name">Usługi</h2>
        <div class="service-item" v-for="service in services" :key="service.id">
          <h3>{{ service.name }}</h3>
          <div class="service-buy">
            <h3 class="service-price">{{ service.price }}zł</h3>
            <h3 class="service-time">{{ service.duration }}min</h3>
          </div>
          <div class="service-button-row">
            <button class="service-buy-button custom-button" @click="makeAnAppointment">Umów</button>
            <button v-if="isOwner" class="service-delete-button custom-button" @click="deleteService(service.id)">Usuń</button>
          </div>
        </div>
        <button v-if="isOwner" class="add-service-button" @click="addService">
          +
          <span class="add-service-button-text">Dodaj usługę</span>
        </button>

        <Transition name="modal-fade">
          <teleport to="body">
            <AddServiceFormModal v-if="isModalOpen" @close="isModalOpen = false" />
          </teleport>
        </Transition>
      </section>

      <section class="reviews-section">
        <h2 class="section-name">Opinie</h2>
        <div class="reviews-summary">
          <div>
            <strong>Średnia ocena: 4.5</strong>
            <p class="star">★★★★☆</p>
            <p>Na podstawie X opinii</p>
          </div>
          <div class="reviews-count">
            <div class="reviews-column">
              <p v-for="i in 5" :key="i" class="reviews-rating">{{ i }}</p>
            </div>
            <div class="reviews-column">
              <p v-for="i in 5" :key="i" class="star">★</p>
            </div>
            <div class="reviews-column">
              <p v-for="i in 5" :key="i" class="reviews-rating">{{ i }}</p>
            </div>
            <!-- ☆ -->
          </div>
        </div>

        <div class="add-review">
          <h2 class="section-name">Dodaj opinię</h2>
          <div class="review-form">
            <div class="review-rating">
              <label for="rating">Ocena:</label>
              <select id="rating" class="custom-select">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
              <p class="star">★</p>
            </div>
            <textarea class="review-textarea" placeholder="Napisz swoją opinię..."></textarea>
            <button class="custom-button">Dodaj opinię</button>
          </div>
        </div>

        <div class="user-reviews">
          <h2 class="section-name">Opinię innych uytkowników</h2>
          <div class="review-item" v-for="i in 3" :key="i">
            <div class="review-info">
              <p class="review-author">Jan Kowalski</p>
              <p class="review-rating">★★★★☆</p>
              <p class="review-date">2023-10-01</p>
            </div>
            <p class="review-text">Bardzo dobra usługa!</p>
          </div>
        </div>
      </section>
    </section>

    <section class="second-column">
      <section class="map-container">
        <iframe class="map-iframe"
          v-if="business.location"
          :src="mapUrl"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <div class="address">
        <strong>Adres:</strong>
        <p>{{ business.location }}</p>
      </div>

      <strong>Godziny otwarcia:</strong>
      <div class="open-hours">
        <div>
          <p class="week-day"
            v-for="(day, i) in ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']"
            :key="i"
            :class="{ 'today': i === todayIndex }"
          >
            {{ day }}
          </p>
        </div>
        <div  v-if="business.opening_hours">
            <p class="day-hours" v-for="(line, i) in business.opening_hours.split('\n')" :key="i" :class="{ 'today': i === todayIndex }">
              {{ line }}<br />
            </p>
        </div>
        <div v-else>Brak danych</div>
      </div>

      <div class="description">
        <strong>Opis:</strong>
        <p>{{ business.description || 'Brak opisu' }}</p>
      </div>
      
      <div class="category">
        <strong>Kategoria:</strong>
        <p>{{ business.category }}</p>
      </div>

      <section v-if="isOwner" class="owner-panel">
        <strong>Panel właściciela:</strong>
        <button class="custom-button">Edytuj</button>
        <button class="custom-button delete-button" @click="deleteBusiness">Usuń</button>
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
import router from '../../router';
import AddServiceFormModal from '@/components/forms/AddServiceFormModal.vue';

const businessStore = useBusinessStore();
const authStore = useAuthStore();
const { myBusiness: business } = storeToRefs(businessStore);
const { serviceItems: services } = storeToRefs(businessStore);

const isOwner = ref(false);
const currentImageIndex = ref(0);
const todayIndex = (new Date().getDay() + 6) % 7;
const isModalOpen = ref(false);

onMounted(async () => {
  try {
    await businessStore.fetchMyBusiness();
    await businessStore.fetchServices();
    checkIsOwner();
  } catch (err) {
    console.error('Błąd podczas ładowania usługi:', err);
  }
});

const deleteBusiness = async () => {
  try {
    await businessStore.deleteMyBusiness();
  } catch (err) {
    console.error('Błąd podczas usuwania usługi:', err);
  }
};

const checkIsOwner = () => {
  try {
    isOwner.value = authStore.user.id === businessStore.myBusiness.user_id;
  } catch (err) {
    console.error('Błąd podczas sprawdzania właściciela:', err);
  }
};

// const mapUrl = computed(() => {
//   const query = encodeURIComponent(business.value.location || '');
//   return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAKVGoLBVhgqkyjYTSOW55-q4tu0iDyGfY&q=${query}`;
// });

const parsedImages = computed(() => {
  try {
    const imagesArray = business.value?.images ? JSON.parse(business.value.images) : [];
    return imagesArray.map(image => `http://127.0.0.1:8000${image}`);
  } catch (e) {
    console.error("Błąd parsowania zdjęć:", e);
    return [];
  }
});

const sliderStyle = computed(() => {
  return {
    transform: `translateX(-${currentImageIndex.value * 100}%)`,
    transition: 'transform 0.5s ease',
  };
});

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < parsedImages.value.length - 1) {
    currentImageIndex.value++;
  }
};

const addService = () => {
  isModalOpen.value = true;
};

const deleteService = async (id) => {
  try {
    await businessStore.deleteService(id);
  } catch (err) {
    console.error('Błąd podczas usuwania usługi:', err);
  }
};

const makeAnAppointment = () => {
  // Implementacja logiki umawiania wizyty
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

//------------- First Column ------------------//

    .first-column {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-right: 20px;
        transition: all 0.3s ease-in-out;
    }

    .photo-container {
      position: relative;
      overflow: hidden;
      box-shadow: 0px 10px 20px 1px $shadow;
      border-radius: 20px;
      margin: 10px 10px 30px 10px;

    }

    .image-slider {
      display: flex;
      transition: transform 0.5s ease;
    }

    .business-image {
      width: 100%;
      object-fit: cover;
      border-radius: 20px;
    }

    .photo-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: $shadow;
      color: white;
      font-size: 30px;
      border: none;
      padding: 10px;
      cursor: pointer;
      z-index: 2;
      transition: all 0.3s ease-in-out;
      
      &:hover {
        font-size: 50px;
      }
    }

    .photo-nav-btn.left {
      left: 10px;
    }

    .photo-nav-btn.right {
      right: 10px;
    }

    .photo-nav-btn:disabled {
      background-color: rgba(0, 0, 0, 0.2);
      cursor: not-allowed;
    }

    .title-container {
        display: flex;
        width: 100%;
        height: auto;
    }
    
    .business-name {
      position: relative;
      font-size: 30px;
      font-weight: bold;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        height: 2px;
        width: 120%;
        background: $primary;
        transform: scaleX(1);
      }
    }
    
    .fav-button {
        margin-left: auto;
        background-color: transparent;
        border: none;
        font-size: 22px;
        transition: all 0.3s ease-in-out;
        outline: none;

        &:hover {
          transform: scale(1.5);
        }
    }

    .services-section {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .service-item {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid $primary;
        flex-wrap: wrap;
        font-size: 15px;
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background: $primary;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease-in-out;
        }

        &:hover::after {
          transform: scaleX(1);
        }
    }
    
    .service-buy {
      display: flex;
      flex-direction: row;
      margin-left: auto;
      gap: 20px;
    }

    .business-add {
      display: flex;
      flex-direction: row;
      margin-left: auto;
      gap: 20px;
    }

    .service-price {

    }

    .service-delete-button {
      &:hover {
        background-color: $red;
        color: $white;
      }
    }

    .service-button-row {
      display: flex;
      flex-direction: row;
      gap: 20px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .add-service-button {
      position: relative;
      background-color: transparent;
      font-size: 35px;
      padding: 0;
      color: $primary;
      border-radius: 0;
      margin-bottom: 20px;
      outline: none;
      border: 1px solid transparent;
      transition: all 0.3s ease-in-out;
    }

    .add-service-button:hover {
      font-size: 50px;
    }

    .add-service-button-text {
      opacity: 0;
      font-size: 30px;
      visibility: hidden;
      position: absolute;
      left: 50%;
      font-size: 10px;
      transform: translateX(-50%) translateY(10px);
      transition: opacity 0.5s ease, transform 0.3s ease, font-size 0.3s ease;
      white-space: nowrap;
    }

    .add-service-button:hover .add-service-button-text {
      opacity: 1;
      visibility: visible;
      font-size: 25px;
      transform: translateX(-50%) translateY(55px);
    }

    .section-name {
      text-align: left;
      transition: all 0.3s ease-in-out;
    }

    .reviews-section {
      margin-bottom: 50px;
    }

    .reviews-summary {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      gap: 50px;
    }

    .reviews-rating {
      margin: 0px;
      text-align: left;
    }

    .reviews-count {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .reviews-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    } 
    
    .review-textarea {
      background-color: transparent;
      border: 2px solid $primary;
      border-radius: 10px;
      padding: 10px;
      resize: none;
      height: 100px;
      color: $primary;
      font-size: 16px;
      outline: none;

    } 
    
    .review-rating {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    } 
    
    .custom-select {
      background-color: transparent;
      color: $primary;
      border: 2px solid $primary;
      border-radius: 10px;
      padding: 5px;
      outline: none;
      cursor: pointer;
      width: 50px;
      font-size: 20px;
      text-align: center;
      transition: all 0.3s ease-in-out;

      &:focus {
        background-color: $primary;
        color: $white;
      }

      &:hover {
        background-color: $primary;
        color: $white;
      }
      
      option {
        background-color: transparent;
      }
    }

    .star {
      transform: scale(2);
      color: $primary;
      margin: 0px;
    }

    .user-reviews  {
      margin-top: 50px;
    }

    .review-item {
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid $primary;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background: $primary;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.3s ease-in-out;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }
    
    .review-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
//------------- Second Column ------------------//
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

      div{
        gap: 10px;
        display: flex;
        flex-direction: column;
      }
    }

    .today {
      font-weight: bold;
      border-radius: 6px;
    }

    .week-day {
      margin: 0px;
    }

    .day-hours{
      margin: 0px;
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

//------------- Modal Styles ------------------//


    .modal-fade-enter-active,
    .modal-fade-leave-active {
      transition: opacity 0.5s ease;
    }

    .modal-fade-enter-from,
    .modal-fade-leave-to {
      opacity: 0;
    }

    .modal-fade-enter-to,
    .modal-fade-leave-from {
      opacity: 1;
    }

//------------- Mobile ------------------//

    @media screen and (max-width: 930px) {

        .main {
            flex-direction: column;
            padding: 0px;
        }

        .first-column {
            width: 100%;
            border-right: none;
            padding-right: 0px;
        }

        .service-buy-button, .service-delete-button {
            width: 100%;
            margin: 0px;
            margin-bottom: 20px;
        }

        .service-button-row {
          width: 100%;
        }

        .section-name {
          text-align: center;
        }

        .review-rating {
          justify-content: center;
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
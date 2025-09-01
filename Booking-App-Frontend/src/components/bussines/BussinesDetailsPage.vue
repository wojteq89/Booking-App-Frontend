<template>
  <div class="main" v-if="business">
    <section class="first-column">
      <div class="photo-container" v-if="parsedImages.length">
        <button class="photo-nav-btn left" @click="prevImage" :disabled="currentImageIndex === 0">
          &#10094;
        </button>
        <div class="image-slider" :style="sliderStyle">
          <img v-for="(image, index) in parsedImages" :key="index" :src="image" class="business-image"
            alt="Zdjęcie usługi" />
        </div>
        <button class="photo-nav-btn right" @click="nextImage"
          :disabled="currentImageIndex === parsedImages.length - 1">
          &#10095;
        </button>
      </div>
      <div class="title-container">
        <h1 class="business-name">{{ business.name }}</h1>
        <div class="business-add">
          <button @click="toggleFavorite()" class="fav-button">
            <span>
              <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"
                :style="{ color: isFavorite ? '#e74c3c' : '' }"></i> </span>
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
            <button v-if="isOwner" class="service-delete-button custom-button"
              @click="deleteService(service.id)">Usuń</button>
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
        <h2 v-if="reviews.reviews.length" class="section-name">Opinie</h2>
        <div class="reviews-summary">
          <div>
            <strong>Średnia ocena: {{ reviews.average_rating }}</strong>
            <div>
              <img v-for="i in starDisplay.full" :key="'full-' + i" class="star"
                src="../../assets/Graphics/full_star.png" alt="Pełna gwiazdka">
              <img v-if="starDisplay.half" class="star" src="../../assets/Graphics/half_star.png" alt="Pół gwiazdki">
              <img v-for="i in starDisplay.empty" :key="'empty-' + i" class="star"
                src="../../assets/Graphics/empty_star.png" alt="Pusta gwiazdka">
            </div>
            <p>Na podstawie {{ reviews.total }} opinii</p>
          </div>
          <div class="reviews-count">
            <div class="reviews-column">
              <p v-for="i in 5" :key="i" class="reviews-rating">{{ i }}</p>
            </div>
            <div class="reviews-column">
              <img v-for="i in 5" :key="i" class="star" src="../../assets/Graphics/full_star.png" alt="Pełna gwiazdka">
            </div>
            <div class="reviews-column">
              <p v-for="(count, rating) in reviews.ratings_breakdown" :key="rating" class="reviews-rating">
                {{ count }}
              </p>
            </div>
          </div>
        </div>

        <div class="add-review" v-if="!reviews.has_user_reviewed">
          <h2 class="section-name">Dodaj opinie</h2>
          <div class="review-form">
            <div class="review-rating">
              <label for="rating">Ocena:</label>
              <select id="rating" class="custom-select" v-model.number="addReviewForm.rating">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
              <p v-for="value in addReviewForm.rating" :key="value" class="star">★</p>
            </div>
            <textarea class="review-textarea" placeholder="Napisz swoją opinie..."
              v-model="addReviewForm.content"></textarea>
            <button class="custom-button" @click="addReview">Dodaj opinie</button>
          </div>
        </div>

        <div v-else>
          <h2 class="section-name">Dziękujemy za twoją opinie!</h2>
          <div class="review-form">
            <div class="review-rating">
              <label for="rating">Ocena:</label>
              <select id="rating" class="custom-select" v-model.number="editReviewForm.rating">
                <option :value="5">5</option>
                <option :value="4">4</option>
                <option :value="3">3</option>
                <option :value="2">2</option>
                <option :value="1">1</option>
              </select>

              <p v-for="value in editReviewForm.rating" :key="value" class="star">★</p>
            </div>
            <textarea class="review-textarea" :placeholder="userReview?.content || 'Napisz swoją opinię...'"
              v-model="editReviewForm.content">
            </textarea>

            <button class="custom-button" @click="editReview">Edytuj opinie</button>
          </div>
        </div>

        <h2 class="section-name">Opinie wszystkich użytkowników</h2>
        <div class="reviews-filter">
          Sortuj według:
          <select id="rating" class="custom-select" v-model.number="rating" @change="onRatingChange">
            <option :value="5">5</option>
            <option :value="4">4</option>
            <option :value="3">3</option>
            <option :value="2">2</option>
            <option :value="1">1</option>
          </select>
          <p v-if="rating" v-for="star in rating" :key="star" class="star">★</p>
          <button class="custom-button" @click="clearFilter">Wyczyść filtr</button>
        </div>
        <div v-if="!reviews.reviews.length" class="user-reviews">
          <h2 class="section-name">Brak opinii</h2>
        </div>
        <div class="user-reviews" v-else>
          <div class="review-item" v-for="review in reviews.reviews" :key="review.id">
            <div class="review-info">
              <p class="review-author">{{ review.client_name }}</p>
              <div class="review-right">
                <p class="review-rating"><span v-for="i in review.rating">★</span></p>
                <p class="review-date">{{ new Date(review.created_at).toLocaleDateString() }}</p>
              </div>
            </div>
            <p class="review-text">{{ review.content }}</p>
          </div>
          <div class="pagination">
            <button class="custom-button" @click="loadReviews(currentPage - 1)"
              :disabled="currentPage === 1">Poprzednia</button>
            <span>Strona {{ currentPage }} z {{ lastPage }}</span>
            <button class="custom-button" @click="loadReviews(currentPage + 1)"
              :disabled="currentPage === lastPage">Następna</button>
          </div>
        </div>
      </section>
    </section>

    <section class="second-column">
      <section class="map-container">
        <div id="leaflet-map" class="map-iframe" v-if="business.location"></div>
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
            :key="i" :class="{ 'today': i === todayIndex }">
            {{ day }}
          </p>
        </div>
        <div v-if="business.opening_hours">
          <p class="day-hours" v-for="(line, i) in business.opening_hours.split('\n')" :key="i"
            :class="{ 'today': i === todayIndex }">
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
        <p>{{ categoryName }}</p>
      </div>
      <section v-if="isOwner" class="owner-panel">
        <strong>Panel właściciela:</strong>
        <button class="custom-button" @click="goToBusinessForm()">Edytuj</button>
        <button class="custom-button delete-button" @click="deleteBusiness">Usuń</button>
      </section>
    </section>
  </div>

  <div v-else>
    <AppLogo class="app-logo" />
  </div>
</template>


<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';
import router from '../../router';
import AddServiceFormModal from '@/components/forms/AddServiceFormModal.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const businessStore = useBusinessStore();
const authStore = useAuthStore();
const { selectedBusiness: business } = storeToRefs(businessStore);
const { serviceItems: services } = storeToRefs(businessStore);
const { serviceReviews: reviews } = storeToRefs(businessStore);

const isOwner = ref(false);
const currentImageIndex = ref(0);
const todayIndex = (new Date().getDay() + 6) % 7;
const isModalOpen = ref(false);
const currentPage = ref(1);
const lastPage = ref(null);
const rating = ref(null);
const isFavorite = ref(false);

const addReviewForm = ref({
  user_id: authStore.user.id,
  client_name: authStore.user.first_name,
  rating: 5,
  content: '',
});

onMounted(async () => {
  try {
    console.log(router.currentRoute.value.name);
    if (router.currentRoute.value.name === 'my-business') {
      await businessStore.fetchMyBusiness();
    } else {
      await businessStore.fetchBusinessById(router.currentRoute.value.params.id);
    }

    await businessStore.fetchServices();
    await businessStore.fetchReviews(1);
    checkIsOwner();
  } catch (err) {
    console.error('Błąd podczas ładowania usługi:', err);
  }

  if (business.value?.location) {
    const location = business.value.location;

    let lat = null, lng = null;

    if (location.includes(',')) {
      [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      initLeafletMap(lat, lng);
    } else {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
            initLeafletMap(lat, lng);
          }
        })
        .catch(err => console.error("Błąd geokodowania:", err));
    }
  }
});

watch(
  () => business.value?.id,
  async (newId) => {
    if (newId) {
      const value = await businessStore.isFavorited(newId);
      isFavorite.value = value.favorited;
    }
  },
  { immediate: true }
);

function initLeafletMap(lat, lng) {
  const map = L.map('leaflet-map').setView([lat, lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
}

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

const addReview = async () => {
  try {
    await businessStore.addReview(addReviewForm);
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

const editReview = async () => {
  try {
    await businessStore.editReview(editReviewForm);
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

const userReview = computed(() => {
  if (!reviews.value?.reviews) return null;
  return reviews.value.reviews.find(review => review.user_id === authStore.user.id) || null;
});

const editReviewForm = ref({
  user_id: authStore.user.id,
  id: null,
  client_name: authStore.user.first_name,
  rating: null,
  content: '',
});

watch(userReview, (newReview) => {
  if (newReview) {
    editReviewForm.value.id = newReview.id;
    editReviewForm.value.rating = Number(newReview.rating);
    editReviewForm.value.content = newReview.content || '';
  }
}, { immediate: true });

watch(() => reviews.value.last_page, (newVal) => {
  if (newVal) lastPage.value = newVal;
});

const loadReviews = async (page = 1) => {
  if (page < 1 || (lastPage.value && page > lastPage.value)) return;
  try {
    const data = await businessStore.fetchReviews(page);
    currentPage.value = data.current_page;
    lastPage.value = data.last_page;
  } catch (e) {
    console.error('Błąd podczas ładowania opinii:', e);
  }
};

function onRatingChange() {
  businessStore.fetchReviews(1, rating.value);
}

function clearFilter() {
  rating.value = null;
  businessStore.fetchReviews(1);
}

const starDisplay = computed(() => {
  const fullStars = Math.floor(reviews.value.average_rating);
  const halfStar = reviews.value.average_rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return {
    full: fullStars,
    half: halfStar,
    empty: emptyStars
  };
});

async function toggleFavorite() {
  const res = await businessStore.toggleFavorite(business.value.id);
  isFavorite.value = res.favorited;
}

const goToBusinessForm = () => {
  router.push('/add-business-form')
}

const categoryName = computed(() => {
  if (!business.value || !business.value.category_id || !businessStore.categories.length) {
    return 'Brak kategorii';
  }

  const foundCategory = businessStore.categories.find(
    (cat) => cat.id === business.value.category_id
  );

  return foundCategory ? foundCategory.name : 'Brak kategorii';
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
  box-shadow: 0px 10px 10px 1px $shadow;
  border-radius: 10px;
  margin: 10px 10px 30px 10px;
}

.image-slider {
  display: flex;
  transition: transform 0.5s ease;
}

.business-image {
  width: 100%;
  object-fit: cover;
}

.photo-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: $shadow;
  outline: none;
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
  color: black;
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

.service-price {}

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

.pagination {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.review-rating {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.custom-select {
  background-color: $primary;
  color: $white;
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
    background-color: transparent;
    color: $primary;
  }

  &:hover {
    background-color: transparent;
    color: $primary;
  }

  option {
    background-color: transparent;
  }
}

.star {
  width: 15px;
  color: $primary;
  margin: 5px;
}

.user-reviews {
  margin-top: 50px;
}

.reviews-filter {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: baseline;

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

.review-author {
  font-weight: bold;
  margin-right: 10px;
}

.review-text {
  text-align: left;
  margin: 0 20px 20px 20px;
}

.review-right {
  display: flex;
  gap: 20px
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
  background-color: rgb(245, 245, 245);
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
}

.map-iframe {
  width: 100%;
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

  div {
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

.day-hours {
  margin: 0px;
}

.description {
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding-bottom: 20px;
  border-bottom: 1px solid $primary;
}


.category {}

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

  .service-buy-button,
  .service-delete-button {
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
    box-shadow: none;
  }

  .photo-container {
    margin: 0;
    box-shadow: none;
  }
}
</style>
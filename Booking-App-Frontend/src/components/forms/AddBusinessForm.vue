<template>
  <div class="container"
    v-if="authStore.user.role === 'user' || (authStore.user.role === 'owner' && business.myBusiness)">
    <AppLogo class="app-logo" />
    <h2 class="title">{{ isEditMode ? 'Zarządzaj swoim biznesem' : 'Dodaj swój biznes' }}</h2>
    <form @submit.prevent="isEditMode ? updateBusiness() : registerBusiness()" class="custom-form"
      enctype="multipart/form-data">
      <input class="input-field" v-model="form.name" placeholder="Dodaj nazwę biznesu" />
      <select v-model="form.category_id" class="input-field">
        <option value="">Wybierz kategorię</option>
        <option v-for="category in business.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <input class="input-field" v-model="form.location" placeholder="Dodaj adres" />
      <input class="input-field" v-model="form.description" placeholder="Dodaj opis" />

      <div class="open-hours-container">
        <h3>Godziny otwarcia</h3>
        <div v-for="(day, index) in daysOfWeek" :key="index" class="day-row">
          <label>
            <input type="checkbox" v-model="openingHours[day].open" />
            {{ day }}
          </label>
          <div v-if="openingHours[day].open" class="time-inputs">
            <input type="time" v-model="openingHours[day].from" />
            <span>do</span>
            <input type="time" v-model="openingHours[day].to" />
          </div>
          <div v-else class="closed-text">Zamknięte</div>
        </div>
      </div>

      <div class="social-links-container">
        <h3>Linki do mediów społecznościowych</h3>
        <input class="input-field" v-model="form.facebook_url" placeholder="Link do Facebooka" />
        <input class="input-field" v-model="form.instagram_url" placeholder="Link do Instagrama" />
        <input class="input-field" v-model="form.youtube_url" placeholder="Link do YouTube" />
        <input class="input-field" v-model="form.website_url" placeholder="Link do strony internetowej" />
      </div>

      <div class="image-container">
        <h3>Zdjęcia</h3>
        <div v-if="form.existingImages.length" class="existing-images-previews">
          <div v-for="(img, index) in form.existingImages" :key="index" class="image-preview">
            <img :src="img" alt="Business Image" class="preview-img" />
            <button class="service-delete-button custom-button" type="button"
              @click="removeExistingImage(index)">Usuń</button>
          </div>
        </div>
        <div class="add-images-container">
          <h3>Nowe zdjęcia do dodania:</h3>
          <input type="file" multiple @change="handleNewImages" />
          <div v-if="form.newImages.length">
            <ul>
              <li v-for="(file, i) in form.newImages" :key="i">{{ file.name }}</li>
            </ul>
          </div>
        </div>
      </div>

      <button class="custom-button" type="submit">{{ isEditMode ? 'Zapisz zmiany' : 'Dodaj biznes' }}</button>
    </form>
  </div>
  <div v-else-if="authStore.user.role === 'user'">
    <p>Aby dodać biznes, wypełnij formularz.</p>
  </div>
  <div v-else>
    <Loader/>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBusinessStore } from '@/stores/business';
import AppLogo from '@/components/common/AppLogo.vue';
import Loader from '../common/Loader.vue';

const authStore = useAuthStore();
const business = useBusinessStore();
const isEditMode = computed(() => !!business.myBusiness);

const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

const parseOpeningHours = (hoursString) => {
  const hours = {};
  if (hoursString) {
    const hoursArray = hoursString.split(/\r?\n/);
    daysOfWeek.forEach((day, index) => {
      const value = hoursArray[index] || 'Zamknięte';
      if (value !== 'Zamknięte') {
        const [from, to] = value.split('-');
        hours[day] = { open: true, from, to };
      } else {
        hours[day] = { open: false, from: '08:00', to: '16:00' };
      }
    });
  } else {
    daysOfWeek.forEach(day => {
      hours[day] = { open: false, from: '08:00', to: '16:00' };
    });
  }
  return hours;
};

const parseImages = (images) => {
  try {
    const imagesArray = images ? JSON.parse(images) : [];
    return imagesArray.map(image => `http://127.0.0.1:8000${image}`);
  } catch (e) {
    console.error("Błąd parsowania zdjęć:", e);
    return [];
  }
};

const form = reactive({
  name: business.myBusiness?.name || '',
  category_id: business.myBusiness?.category_id || '',
  location: business.myBusiness?.location || '',
  description: business.myBusiness?.description || '',
  newImages: [],
  existingImages: parseImages(business.myBusiness?.images),
  facebook_url: business.myBusiness?.facebook_url || '',
  instagram_url: business.myBusiness?.instagram_url || '',
  youtube_url: business.myBusiness?.youtube_url || '',
  website_url: business.myBusiness?.website_url || ''
});

const openingHours = reactive(parseOpeningHours(business.myBusiness?.opening_hours));

onMounted(() => {
  business.fetchCategories();
  if (authStore.user.role === 'owner') {
    business.fetchMyBusiness();
  }
});

const handleNewImages = (e) => {
  form.newImages = Array.from(e.target.files);
};

const removeExistingImage = (index) => {
  form.existingImages.splice(index, 1);
};

const generateOpeningHoursString = () => {
  return daysOfWeek
    .map(day => {
      const { open, from, to } = openingHours[day];
      return open ? `${from}-${to}` : 'Zamknięte';
    })
    .join('\n');
};

const registerBusiness = async () => {
  const data = new FormData();
  data.append('name', form.name);
  data.append('category_id', form.category_id);
  data.append('location', form.location);
  data.append('description', form.description);
  data.append('opening_hours', generateOpeningHoursString());
  data.append('facebook_url', form.facebook_url);
  data.append('instagram_url', form.instagram_url);
  data.append('youtube_url', form.youtube_url);
  data.append('website_url', form.website_url);
  form.newImages.forEach(file => data.append(`images[]`, file));
  await business.registerBusiness(data);
};

const updateBusiness = async () => {
  const data = new FormData();
  data.append('name', form.name);
  data.append('category_id', form.category_id);
  data.append('location', form.location);
  data.append('description', form.description);
  data.append('opening_hours', generateOpeningHoursString());
  data.append('facebook_url', form.facebook_url);
  data.append('instagram_url', form.instagram_url);
  data.append('youtube_url', form.youtube_url);
  data.append('website_url', form.website_url);
  form.newImages.forEach(file => data.append('images[]', file));
  const existingPaths = form.existingImages.map(url => url.replace('http://127.0.0.1:8000', ''));
  data.append('existing_images', JSON.stringify(existingPaths));
  await business.updateBusiness(business.myBusiness.id, data);
};
</script>


<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.open-hours-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.day-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.day-row label {
  display: flex;
  gap: 10px;
}

input[type="checkbox"] {
  width: 25px;
  height: 25px;
  accent-color: $primary;
  cursor: pointer;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="time"] {
  font-size: 16px;
  border: 2px solid transparent;
  border-radius: 20px;
  background-color: transparent;
  color: $primary;
  outline: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &::-webkit-inner-spin-button,
  &::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }

  &:hover {
    background-color: $primary;
    color: $white;
    padding: 10px;

    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      display: block;
    }
  }

  &:focus {
    background-color: $primary;
    color: $white;
    padding: 10px;

    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      display: block;
    }
  }
}

.social-links-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.closed-text {
  font-style: italic;
  color: $hint;
  text-align: right;
  transition: all 0.5s ease-in-out;

  &:hover {
    color: $primary;
    font-size: 20px;
  }
}

.add-images-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
}

.image-container {
  margin-top: 20px;
}

.image-container h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.preview-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.service-delete-button {
  width: 60%;

  &:hover {
    background-color: $red;
    color: $white;
  }
}

.image-container input[type="file"] {
  display: block;
  margin-top: 10px;
}

.image-container ul {
  list-style: none;
  padding: 0;
  margin-top: 5px;
}

.image-container ul li {
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}
</style>

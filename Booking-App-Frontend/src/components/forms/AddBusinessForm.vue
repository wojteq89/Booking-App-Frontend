<template>
  <div>
    <div class="container" v-if="authStore.user.role == 'user'">
      <AppLogo class="app-logo" />
      <h2 class="title">Dodaj swój biznes</h2>
      <form @submit.prevent="registerBusiness" class="custom-form" enctype="multipart/form-data">
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

        <div class="add-images-container">
          <h3>Zdjęcia</h3>
          <input type="file" multiple @change="handleNewImages" />
        </div>
        <button class="custom-button" type="submit">Dodaj biznes</button>
      </form>
    </div>

    <!-- Formularz dla właściciela -->
    <div v-if="authStore.user.role == 'owner' && business.myBusiness" class="container">
      <AppLogo class="app-logo" />
      <h2 class="title">Zarządzaj swoim biznesem</h2>
      <form @submit.prevent="updateBusiness" class="custom-form" enctype="multipart/form-data">
        <input class="input-field" v-model="form.name"
          :placeholder="business.myBusiness.name || 'Dodaj nazwę biznesu'" />
        <select v-model="form.category_id" class="input-field">
          <option value="">
            {{ business.categories[business.myBusiness.category_id ? business.myBusiness.category_id - 1 : 0].name }}
          </option>
          <option v-for="category in business.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <input class="input-field" v-model="form.location"
          :placeholder="business.myBusiness.location || 'Dodaj adres'" />
        <input class="input-field" v-model="form.description"
          :placeholder="business.myBusiness.description || 'Dodaj opis'" />

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
          <input class="input-field" v-model="form.facebook_url"
            :placeholder="business.myBusiness.facebook_url || 'Link do Facebooka'" />
          <input class="input-field" v-model="form.instagram_url"
            :placeholder="business.myBusiness.instagram_url || 'Link do Instagrama'" />
          <input class="input-field" v-model="form.youtube_url"
            :placeholder="business.myBusiness.youtube_url || 'Link do YouTube'" />
          <input class="input-field" v-model="form.website_url"
            :placeholder="business.myBusiness.website_url || 'Link do strony internetowej'" />
        </div>

        <div class="image-container">
          <h3>Zdjęcia</h3>

          <!-- Istniejące zdjęcia -->
          <div v-if="form.existingImages.length">
            <div v-for="(img, index) in form.existingImages" :key="index" class="image-preview">
              <img :src="img" alt="Business Image" class="preview-img" />
              <button class="service-delete-button custom-button" type="button"
                @click="removeExistingImage(index)">Usuń</button>
            </div>
          </div>

          <!-- Dodawanie nowych zdjęć -->
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

        <button class="custom-button" type="submit">Zapisz zmiany</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watchEffect, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBusinessStore } from '@/stores/business'

const authStore = useAuthStore()
const business = useBusinessStore()

const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']

const form = reactive({
  name: '',
  category_id: '',
  location: '',
  description: '',
  newImages: [],
  existingImages: [],
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  website_url: ''
})

onMounted(() => {
  business.fetchCategories();
});

const openingHours = reactive(
  Object.fromEntries(daysOfWeek.map(day => [day, { open: false, from: '08:00', to: '16:00' }]))
)

const parsedImages = computed(() => {
  try {
    const imagesArray = business.myBusiness?.images ? JSON.parse(business.myBusiness.images) : []
    return imagesArray.map(image => `http://127.0.0.1:8000${image}`)
  } catch (e) {
    console.error("Błąd parsowania zdjęć:", e)
    return []
  }
})

watchEffect(() => {
  if (business.myBusiness) {
    form.name = business.myBusiness.name || ''
    form.category_id = business.myBusiness.category?.id || '';
    form.location = business.myBusiness.location || ''
    form.description = business.myBusiness.description || ''
    form.existingImages = parsedImages.value
    form.facebook_url = business.myBusiness.facebook_url || ''
    form.instagram_url = business.myBusiness.instagram_url || ''
    form.youtube_url = business.myBusiness.youtube_url || ''
    form.website_url = business.myBusiness.website_url || ''

    if (business.myBusiness.opening_hours) {
      const hoursArray = business.myBusiness.opening_hours.split(/\r?\n/)
      daysOfWeek.forEach((day, index) => {
        const value = hoursArray[index] || 'Zamknięte'
        if (value !== 'Zamknięte') {
          const [from, to] = value.split('-')
          openingHours[day].open = true
          openingHours[day].from = from
          openingHours[day].to = to
        } else {
          openingHours[day].open = false
        }
      })
    }
  }
})

const handleNewImages = (e) => {
  form.newImages = Array.from(e.target.files)
}

const removeExistingImage = (index) => {
  form.existingImages.splice(index, 1)
}

const generateOpeningHoursString = () => {
  return daysOfWeek
    .map(day => {
      const { open, from, to } = openingHours[day]
      return open ? `${from}-${to}` : 'Zamknięte'
    })
    .join('\n')
}

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

  form.newImages.forEach(file => {
    data.append(`images[]`, file);
  });

  await business.registerBusiness(data);
};

const updateBusiness = async () => {
  const data = new FormData()
  data.append('name', form.name)
  data.append('category_id', form.category_id);
  data.append('location', form.location)
  data.append('description', form.description)
  data.append('opening_hours', generateOpeningHoursString())
  data.append('facebook_url', form.facebook_url);
  data.append('instagram_url', form.instagram_url);
  data.append('youtube_url', form.youtube_url);
  data.append('website_url', form.website_url);

  form.newImages.forEach(file => data.append('images[]', file))

  const existingPaths = form.existingImages.map(url => url.replace('http://127.0.0.1:8000', ''))
  data.append('existing_images', JSON.stringify(existingPaths))

  const response = await business.updateBusiness(business.myBusiness.id, data)
  console.log(response)
}
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

<template>
<div>
    <div class="container" v-if="authStore.user.role == 'user'">
        <AppLogo class="app-logo" />
        <h2 class="title">Dodaj swój biznes</h2>
        <form @submit.prevent="registerBusiness" class="custom-form" enctype="multipart/form-data">
            <input class="input-field" v-model="form.name" placeholder="Dodaj nazwę biznesu" />
            <input class="input-field" v-model="form.category" placeholder="Wybierz kategorię" />
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

            <!-- Nowe pole: zdjęcia -->
            <input type="file" multiple @change="handleImageUpload" />

            <button class="custom-button" type="submit">Dodaj biznes</button>
        </form>

    </div>
    <div v-if="authStore.user.role == 'owner'">
        <p>Zalogowano jako: {{ authStore.user ? authStore.user.first_name : 'User' }}</p>
        <button class="custom-button" @click="authStore.logout()">Wyloguj</button>
    </div>
</div>
</template>

<script setup>
import {
    ref,
    reactive
} from 'vue'
import {
    useAuthStore
} from '@/stores/auth'
import {
    useBusinessStore
} from '@/stores/business'

const authStore = useAuthStore()
const business = useBusinessStore()

const form = reactive({
    name: '',
    category: '',
    location: '',
    description: '',
    opening_hours: '',
    images: [] 
});

const daysOfWeek = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

const openingHours = reactive(
  Object.fromEntries(
    daysOfWeek.map(day => [
      day,
      { open: false, from: '08:00', to: '16:00' }
    ])
  )
);

const generateOpeningHoursString = () => {
  return daysOfWeek
    .map(day => {
      const { open, from, to } = openingHours[day];
      return open ? `${from}-${to}` : 'Zamknięte';
    })
    .join('\n');
};

const handleImageUpload = (e) => {
    form.images = Array.from(e.target.files);
};

const registerBusiness = async () => {
    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('location', form.location);
    data.append('description', form.description);
    data.append('opening_hours', generateOpeningHoursString());

    form.images.forEach((file, index) => {
        data.append(`images[]`, file);
    });

    await business.registerBusiness(data);
};
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss"as *;

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
</style>

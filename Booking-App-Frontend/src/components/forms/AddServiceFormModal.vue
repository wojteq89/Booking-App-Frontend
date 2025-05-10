<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content" v-if="business">
        <AppLogo class="app-logo" />
        <h2 class="description">Dodaj nową usługę w</h2>
        <form @submit.prevent="handleSubmit" class="custom-form">
          <h2 class="business-name">{{ business.name }}</h2>
          <input class="input-field" type="text" placeholder="Nazwa usługi" />
          <input class="input-field" placeholder="Opis" />
          <input class="input-field" placeholder="Czas trwania" />
          <input class="input-field" type="number" placeholder="Cena" />
          <button class="custom-button" type="submit">Dodaj usługę</button>
        </form>
        <button class="custom-button cancel-button" @click="$emit('close')">Anuluj</button>
      </div>
      <div v-else>
        <AppLogo class="app-logo" />
      </div>
    </div>
  </template>
  

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useBusinessStore } from '@/stores/business';
    import { storeToRefs } from 'pinia';
    import router from '../../router';

    const businessStore = useBusinessStore();
    const authStore = useAuthStore();
    const { myBusiness: business } = storeToRefs(businessStore);


    onMounted(async () => {
        if (business.value === null) {
            $emit('close');
        }
    });
</script>

<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;

    .modal-overlay {
        position: fixed;
        inset: 0px 0px 0px 0px;
        background-color: $shadow;
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 60;
        animation: fadeIn 0.5s ease;
    }

    .modal-content {
        background-color: $white;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        box-shadow: 0 10px 25px $shadow;
        animation: slideUp 0.5s ease;
        max-width: 600px;
        width: 100%;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .description {
        margin-top: 30px;
        margin-bottom: 0;
    }

    .business-name {
        margin: 0;
        font-size: 40px;
        text-align: center;
    }

    .cancel-button {
        width: 80%;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    @media screen and (max-width: 930px) {
        .modal-content {
            width: 80%;
        }
        
    }
</style>
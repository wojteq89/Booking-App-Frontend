<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content" v-if="business">
            <AppLogo class="app-logo" v-if="!isMobile" />
            <h2 class="description">Dodaj nową usługę w</h2>
            <form @submit.prevent="handleSubmit" class="custom-form">
                <h2 class="business-name">{{ business.name }}</h2>
                <input class="input-field" type="text" placeholder="Nazwa usługi" v-model="formData.name" />
                <input class="input-field" placeholder="Opis" v-model="formData.description" />
                <input class="input-field" placeholder="Czas trwania (minuty)" v-model="formData.duration" />
                <input class="input-field" type="number" step="0.01" placeholder="Cena (np: 10.99)"
                    v-model="formData.price" />

                <div class="color-picker-container">
                    <p>Wybierz kolor do kalendarza:</p>
                    <div class="colors-wrapper">
                        <div v-for="colorOption in colorOptions" :key="colorOption"
                            :class="['color-box', { 'selected': formData.color === colorOption }]"
                            :style="{ backgroundColor: colorOption }" @click="selectColor(colorOption)">
                        </div>
                    </div>
                </div>

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
import { onMounted, reactive, ref, onUnmounted } from 'vue';
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';

const businessStore = useBusinessStore();
const { myBusiness: business } = storeToRefs(businessStore);
const isMobile = ref(false);

const colorOptions = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'gray', 'black'
];

const formData = reactive({
    service_id: business.value.id,
    name: '',
    description: '',
    duration: '',
    price: '',
    color: null,
});

onMounted(async () => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    console.log(isMobile.value);
    if (business.value === null) {
        $emit('close');
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile);
});

const handleSubmit = async () => {
    try {
        await businessStore.addService(formData);
    } catch (error) {
        console.error('Error adding service:', error);
    }
};

const selectColor = (color) => {
    formData.color = color;
};

const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= 930;
};
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

.color-picker-container {
    margin-top: 1rem;
    text-align: left;
}

.color-picker-container p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

.colors-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.color-box {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.2s, border-color 0.2s;
}

.color-box:hover {
    transform: scale(1.1);
}

.color-box.selected {
    transform: scale(1.3);
}

@media screen and (max-width: 768px) {
    .modal-content {
        width: 70%;
        height: 80%;
    }

    .description {
        font-size: 17px;
    }

    .business-name {
        font-size: 18px;
    }

}
</style>
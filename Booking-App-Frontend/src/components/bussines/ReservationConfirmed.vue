<template>
    <div class="container" style="margin-top: 30px; height: 750px;">
        <AppLogo />
        <div class="page-header">
            <h1 class="page-title">Potwierdzono wizytę</h1>
            <p class="page-subtitle">Wybierz co dalej</p>
        </div>
        <div>
            <p>Nazwa: {{ businessStore.selectedServiceItem?.name || '-' }}</p>
            <p>Opis: {{ businessStore.selectedServiceItem?.description || '-' }}</p>
            <p>Czas: {{ businessStore.selectedServiceItem?.duration || '-' }} min</p>
            <p>Cena: {{ businessStore.selectedServiceItem?.price || '-' }}</p>
            <p>Początek: {{ businessStore.selectedTime ? new Date(businessStore.selectedTime).toLocaleString() : '-' }}
            </p>
            <p>Koniec: {{ appointmentEndTime ? appointmentEndTime.toLocaleString() : '-' }}</p>
        </div>
        <div class="button-group">
            <button type="button" class="custom-button" @click="payAppointment">Zapłać</button>
            <button class="custom-button">
                <a :href="googleCalendarLink" target="_blank" class="google-calendar-button">
                    <i class="fas fa-calendar-plus"></i> Dodaj do Google Calendar
                </a>
            </button>
            <button class="custom-button" @click="cancelAppointment()">Anuluj rezerwację</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBusinessStore } from '../../stores/business'
import router from '../../router'
import axios from 'axios'
import axiosPreset from '../../axiosPreset'

const businessStore = useBusinessStore()

const appointmentEndTime = computed(() => {
    if (!businessStore.selectedTime || !businessStore.selectedServiceItem?.duration) return null;

    const start = new Date(businessStore.selectedTime);
    const durationMinutes = businessStore.selectedServiceItem.duration;
    return new Date(start.getTime() + durationMinutes * 60000);
});

const cancelAppointment = () => {
    businessStore.cancelAppointment(businessStore.confirmedAppointment.id)
    router.push('/browse-page')
}

const googleCalendarLink = computed(() => {
    if (!businessStore.selectedServiceItem || !businessStore.selectedTime || !appointmentEndTime.value) return '#';

    const start = new Date(businessStore.selectedTime).toISOString().replace(/-|:|\.\d+/g, '');
    const end = appointmentEndTime.value.toISOString().replace(/-|:|\.\d+/g, '');

    const title = encodeURIComponent(`${businessStore.selectedServiceItem.name}`);
    const details = encodeURIComponent(businessStore.selectedServiceItem.description || '');
    const location = encodeURIComponent(businessStore.selectedServiceItem.location || '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
});

const payAppointment = async (e) => {
    e.preventDefault()  // zatrzymuje domyślne submitowanie
    try {
        const appointmentId = businessStore.confirmedAppointment.id
        const response = await axiosPreset.post(`/appointments/${appointmentId}/pay`)
        const redirectUrl = response.data?.redirectUri?.trim()

        console.log('Link do platnosci', redirectUrl)

        if (redirectUrl && redirectUrl.startsWith('http')) {
            window.location.assign(redirectUrl)
        } else {
            console.error('Niepoprawny link do płatności', redirectUrl)
            alert('Nie udało się rozpocząć płatności.')
        }
    } catch (error) {
        console.error(error)
        alert('Nie udało się rozpocząć płatności.')
    }
}

</script>


<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.button-group {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-wrap: wrap;
}

button a {
    color: $primary;
}

button:hover a {
    color: $white;
}
</style>
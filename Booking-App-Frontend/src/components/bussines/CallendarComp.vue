<template>
    <div class="calendar-page">
        <div class="calendar-container">
            <FullCalendar :options="calendarOptions" />
        </div>

        <div v-if="serviceItem" class="service-info-card" :style="{ borderColor: serviceItem.color }">
            <div class="service-info-header">
                <h2 class="service-name" :style="{ color: serviceItem.color }">
                    {{ serviceItem.name }}
                </h2>
                <div class="service-meta">
                    <span class="service-price">{{ serviceItem.price }} zł</span>
                    <span class="duration">⏱ {{ serviceItem.duration }} min</span>
                    <span class="color-dot" :style="{ backgroundColor: serviceItem.color }"></span>
                </div>
            </div>
            <p class="service-description">{{ serviceItem.description || 'Brak opisu' }}</p>
        </div>

        <div class="available-slots" v-if="businessStore.availableSlots.length">
            <h3>Dostępne godziny:</h3>
            <ul>
                <li v-for="(slot, index) in businessStore.availableSlots" :key="index">
                    {{ slot }}
                </li>
            </ul>
        </div>
        <div v-else>
            Brak dostępnych godzin
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBusinessStore } from '@/stores/business'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const businessStore = useBusinessStore()
const { selectedServiceItem: serviceItem, selectedBusiness } = storeToRefs(businessStore)

// parsedOpeningHours pobiera teraz dynamicznie z store
const parsedOpeningHours = computed(() => {
    if (!selectedBusiness.value?.opening_hours) return {}

    const days = selectedBusiness.value.opening_hours
        .split(/\r?\n/)
        .map(d => d.trim());

    const map = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
    const schedule = {};
    for (let jsDay = 0; jsDay < 7; jsDay++) {
        const businessIndex = map[jsDay];
        schedule[jsDay] = days[businessIndex].toLowerCase() === 'zamknięte';
    }
    return schedule;
});

const handleDateClick = (info) => {
    const clickedDayOfWeek = info.date.getDay();
    if (parsedOpeningHours.value[clickedDayOfWeek]) {
        console.log('Kliknięto w dzień zamknięty. Akcja niedozwolona.');
    } else {
        console.log('Kliknięty dzień:', info.dateStr);
    }
};

const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    const event = info.event;
    console.log('Kliknięto w wydarzenie o tytule:', event.title);
};

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'pl',
    firstDay: 1,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
        today: 'Dziś',
        month: 'Miesiąc',
        week: 'Tydzień',
        day: 'Dzień'
    },
    events: selectedBusiness.value?.appointments || [], // dynamiczne eventy
    height: 700,
    dateClick: handleDateClick,
    eventClick: handleEventClick,
    dayCellClassNames: (info) => {
        const dayOfWeek = info.date.getDay();
        if (parsedOpeningHours.value[dayOfWeek]) {
            return ['fc-day-closed'];
        }
        return [];
    }
}));
</script>


<style lang="scss" scoped>
@use "sass:color";

.calendar-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.service-info-card {
    margin-top: 20px;
    border: 2px solid;
    border-radius: 16px;
    padding: 16px;
    background: $white;
    box-shadow: 0 4px 12px $shadow;
}

.service-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.service-name {
    font-size: 1.4rem;
    font-weight: 600;
}

.service-price {
    font-size: 1.2rem;
    font-weight: 500;
}

.service-description {
    margin-top: 8px;
    font-size: 1rem;
    text-align: left;
}

.service-meta {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
}

.duration {
    font-size: 20px;
}

.color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
}

.calendar-container {
    margin-top: 20px;
}

:deep(.fc-button-primary) {
    background-color: $primary;
    border-color: $primary;
    transition: all 0.3s ease;
}

:deep(.fc-button-primary:not(:disabled):hover) {
    background-color: color.adjust($color: $primary, $lightness: -10%);
}

:deep(.fc-daygrid-day-frame) {
    cursor: pointer;
    background-color: $primary-light;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

:deep(.fc-daygrid-day-frame:hover) {
    border: 2px solid $primary !important;
    cursor: pointer;
}

:deep(.fc-day) {
    background-color: $primary;
}

:deep(.fc-daygrid-day-number) {
    color: $primary;
}

:deep(.fc-col-header-cell-cushion) {
    color: $white;
}

:deep(.fc-day-today .fc-daygrid-day-frame) {
    background-color: $primary-light;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
    font-weight: bold;
}

/* Dni zamknięte */
:deep(.fc-day-closed) {
    background-color: $primary-light !important;
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}
</style>

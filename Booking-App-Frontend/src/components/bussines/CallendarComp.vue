<template>
    <div class="calendar-page">
        <div class="calendar-container">
            <FullCalendar :options="calendarOptions" />
        </div>

        <div style="padding: 0px 20px;">
            <div v-if="serviceItem" class="service-info-card" id="select-date"
                :style="{ borderColor: serviceItem.color }">
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

            <div>
                <h3 v-if="businessStore.availableSlots.length">Dostępne terminy <br> {{ formattedSelectedDay }}</h3>
                <h3 v-else>Brak dostępnych terminów na dzisiejszy dzień</h3>
                <div class="available-slots" v-if="businessStore.availableSlots.length">
                    <button class="custom-button" v-for="(slot, index) in businessStore.availableSlots" :key="index"
                        @click="selectedHour = slot" :class="{ 'active-hour': selectedHour === slot }">
                        {{ slot }}
                    </button>
                </div>
                <button v-if="businessStore.availableSlots.length" @click="bookAppointment"
                    class="custom-button submit-button">Umów</button>
                <div class="available-slots" style="margin-bottom: 100px;" v-else>
                    {{ businessStore.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBusinessStore } from '@/stores/business'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const businessStore = useBusinessStore()
const { selectedServiceItem: serviceItem, selectedBusiness, allBusinessApointments } = storeToRefs(businessStore)
const selectedDay = ref(null)
const selectedHour = ref(null)

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

const mappedEvents = computed(() => {
    if (!allBusinessApointments.value || !Array.isArray(allBusinessApointments.value)) {
        return [];
    }
    return allBusinessApointments.value
        .filter(appointment => appointment.status === 'Potwierdzona')
        .map(appointment => ({
            id: appointment.id,
            title: `${appointment.service_item.name}`,
            start: appointment.start.replace(' ', 'T'),
            end: appointment.end.replace(' ', 'T'),
            color: getColorForStatus(appointment.status)
        }));
});

const getColorForStatus = (status) => {
    switch (status) {
        case 'Potwierdzona':
            return 'green';
        case 'Anulowana':
            return 'red';
        case 'Zakończona':
            return 'gray';
        default:
            return 'blue';
    }
};

const handleDateClick = (info) => {
    const clickedDayOfWeek = info.date.getDay()
    selectedDay.value = info.dateStr

    businessStore.fetchAppointmentsSlots(
        serviceItem.value?.id,
        info.dateStr
    )

    if (parsedOpeningHours.value[clickedDayOfWeek]) {
        console.log('Kliknięto w dzień zamknięty. Akcja niedozwolona.')
    } else {
        console.log('Kliknięty dzień:', info.dateStr)

        const el = document.getElementById('select-date')
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 500)
        }

    }
}

const formattedSelectedDay = computed(() => {
    if (!selectedDay.value) return ''

    const date = new Date(selectedDay.value)

    return new Intl.DateTimeFormat('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(date)
})

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
    events: mappedEvents.value,
    height: 'auto',
    aspectRatio: 1.2,
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

watch(() => businessStore.availableSlots, (slots) => {
    if (slots.length) {
        selectedHour.value = slots[0]
    } else {
        selectedHour.value = null
    }
}, { immediate: true })

const bookAppointment = async () => {
    if (!selectedHour.value || !selectedDay.value || !serviceItem.value) return;

    const startDateTime = `${selectedDay.value} ${selectedHour.value}:00`;

    try {
        const appointment = await businessStore.storeAppointment(serviceItem.value.id, startDateTime)
        console.log('Wizyta umówiona:', appointment)
    } catch (err) {
        alert(err.message)
    }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/styles/commonStyles.scss" as *;

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

.available-slots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.submit-button {
    width: 30%;
    margin-top: 20px;
    margin-bottom: 100px;
}

.active-hour {
    background-color: $primary;
    color: $white;
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
    width: 40px;
    height: 40px;
    text-align: center;
    padding-top: 7px;
    border: 1px solid $primary;
    border-radius: 999px;
}

:deep(.fc-day-closed) {
    background-color: $primary-light !important;
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}

@media (max-width: 768px) {
    .calendar-container {
        margin-top: 10px;
    }

    :deep(.fc-header-toolbar) {
        flex-direction: column;
        gap: 8px;
        text-align: center;
    }

    :deep(.fc-daygrid-day-number) {
        width: 28px;
        height: 28px;
        font-size: 0.9rem;
        padding-top: 5px;
    }

    :deep(.fc-daygrid-event) {
        font-size: 0.75rem;
        padding: 1px 2px;
    }

    .available-slots {
        flex-direction: row;
    }

    .service-info-header {
        flex-direction: column;
    }

    .service-description {
        text-align: center;
    }
}
</style>

<template>
    <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const selectedBusiness = reactive({
    business: {
        id: 1,
        name: "Fryzjer 123",
        opening_hours: "03:45-13:53\nZamknięte\nZamknięte\n08:42-15:05\n08:00-16:00\nZamknięte\nZamknięte",
    }
});

const parsedOpeningHours = computed(() => {
    const days = selectedBusiness.business.opening_hours
        .split(/\r?\n/) 
        .map(d => d.trim());

    const map = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };

    const schedule = {};
    for (let jsDay = 0; jsDay < 7; jsDay++) {
        const businessIndex = map[jsDay];
        schedule[jsDay] = days[businessIndex].toLowerCase() === 'zamknięte';
    }

    console.log("parsedOpeningHours:", schedule);
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

const calendarOptions = {
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
    events: [
        { id: 1, title: 'Wizyta u fryzjera', start: '2025-09-03T10:00:00', end: '2025-09-03T10:20:00' },
        { id: 2, title: 'Konsultacja z klientem', start: '2025-09-04T14:30:00', end: '2025-09-04T15:30:00', color: 'red' },
        { id: 3, title: 'Spotkanie', start: '2025-09-02T14:30:00', end: '2025-09-02T15:30:00' },
    ],
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
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.calendar-container {
    margin-top: 50px;
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


:deep(.fc-day-closed) {
    background-color: $primary-light !important;
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}
</style>
<template>
    <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const handleDateClick = (info) => {
    console.log('Kliknięty dzień:', info.dateStr)
}

const handleEventClick = (info) => {
    info.jsEvent.preventDefault(); 
    
    const event = info.event;
    console.log('Kliknięto w wydarzenie o tytule:', event.title);
    console.log('ID wydarzenia:', event.id);
    console.log('Dane wydarzenia:', event.extendedProps);
}

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'pl',
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
        {
            id: 1,
            title: 'Wizyta u fryzjera',
            start: '2025-09-03T10:00:00',
            end: '2025-09-03T10:20:00'
        },
        {
            id: 2,
            title: 'Konsultacja z klientem',
            start: '2025-09-04T14:30:00',
            end: '2025-09-04T15:30:00',
            color: 'red'
        },
        {
            id: 3,
            title: 'Spotkanie',
            start: '2025-09-02T14:30:00',
            end: '2025-09-02T15:30:00',
        }
    ],
    height: 700,
    dateClick: handleDateClick,
    
    eventClick: handleEventClick
}
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
    background-color: #f0f8ff;
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

:deep(.fc-day-other) {
    opacity: 0.5;
}
</style>
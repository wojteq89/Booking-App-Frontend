<template>
    <div v-if="businessStore.isLoading" class="loading-state">
        <Loader />
    </div>
    <div v-else class="bookings-page">
        <div class="page-header">
            <h1 class="page-title">Moje Rezerwacje</h1>
            <p class="page-subtitle">Zarządzaj swoimi wizytami i śledź ich status</p>
        </div>

        <div class="bookings-container">
            <!-- Sekcja Potwierdzone -->
            <div class="bookings-section">
                <div class="section-header">
                    <div class="header-content">
                        <span class="badge-count">{{ confirmedAppointments.length }}</span>
                        <h2 class="section-title">Nadchodzące wizyty</h2>
                    </div>
                    <div class="section-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                </div>

                <div v-if="confirmedAppointments.length > 0" class="appointments-list">
                    <div v-for="appointment in confirmedAppointments" :key="appointment.id"
                        class="appointment-card confirmed">
                        <div class="card-content">
                            <div class="appointment-info">
                                <h3 class="service-name">{{ appointment.service.name }}</h3>
                                <p class="service-item">{{ appointment.service_item.name }}</p>

                                <div class="appointment-details">
                                    <div class="detail-item">
                                        <i class="fas fa-clock"></i>
                                        <span>{{ formatDateTime(appointment.start) }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>{{ businessStore.categories[appointment.service.category_id]?.name ||
                                            'Inne' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="appointment-status">
                                <span class="status-badge confirmed">
                                    <i class="fas fa-check-circle"></i>
                                    {{ appointment.status }}
                                </span>
                                <button class="action-button" @click="handleAppointmentAction(appointment)">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        </div>

                        <div class="card-actions" v-if="appointment.showActions">
                            <button class="cancel-button" @click="cancelAppointment(appointment)">
                                <i class="fas fa-times"></i> Anuluj
                            </button>
                            <button class="cancel-button" @click="cancelAppointment(appointment)">
                                <a :href="getGoogleCalendarLink(appointment)" target="_blank"
                                    class="google-calendar-button">
                                    <i class="fas fa-calendar-plus"></i> Dodaj do Google Calendar
                                </a>
                            </button>

                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>Brak nadchodzących wizyt</h3>
                    <p>Zaplanuj nową wizytę, aby zobaczyć ją tutaj</p>
                </div>
            </div>

            <!-- Sekcja Historia -->
            <div class="bookings-section">
                <div class="section-header">
                    <div class="header-content">
                        <span class="badge-count">{{ otherAppointments.length }}</span>
                        <h2 class="section-title">Historia wizyt</h2>
                    </div>
                    <div class="section-icon">
                        <i class="fas fa-history"></i>
                    </div>
                </div>

                <div v-if="otherAppointments.length > 0" class="appointments-list">
                    <div v-for="appointment in otherAppointments" :key="appointment.id" class="appointment-card history"
                        :class="appointment.status.toLowerCase()">
                        <div class="card-content">
                            <div class="appointment-info">
                                <h3 class="service-name">{{ appointment.service.name }}</h3>
                                <p class="service-item">{{ appointment.service_item.name }}</p>

                                <div class="appointment-details">
                                    <div class="detail-item">
                                        <i class="fas fa-clock"></i>
                                        <span>{{ formatDate(appointment.start) }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>{{ businessStore.categories[appointment.service.category_id]?.name ||
                                            'Inne' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="appointment-status">
                                <span class="status-badge" :class="appointment.status.toLowerCase()">
                                    <i :class="getStatusIcon(appointment.status)"></i>
                                    {{ appointment.status }}
                                </span>
                            </div>
                        </div>

                        <div class="card-footer" v-if="appointment.status === 'Zakończona'">
                            <button class="review-button" @click="addReview(appointment)">
                                <i class="fas fa-star"></i> Oceń wizytę
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Brak historii wizyt</h3>
                    <p>Twoja historia wizyt pojawi się tutaj</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useBusinessStore } from '@/stores/business';
import router from '../../router';
import Loader from '../common/Loader.vue';

const businessStore = useBusinessStore();

const appointmentsWithActions = ref([]);

const confirmedAppointments = computed(() => {
    const appointments = businessStore.history.filter(appointment => appointment.status === 'Potwierdzona');
    return appointments.map(app => ({
        ...app,
        showActions: appointmentsWithActions.value.includes(app.id)
    }));
});

const otherAppointments = computed(() => {
    return businessStore.history.filter(appointment => appointment.status !== 'Potwierdzona');
});

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Anulowana':
            return 'fas fa-times-circle';
        case 'Zakończona':
            return 'fas fa-check-circle';
        default:
            return 'fas fa-info-circle';
    }
};

const handleAppointmentAction = (appointment) => {
    const index = appointmentsWithActions.value.indexOf(appointment.id);
    if (index > -1) {
        appointmentsWithActions.value.splice(index, 1);
    } else {
        appointmentsWithActions.value.push(appointment.id);
    }
};

const cancelAppointment = (appointment) => {
    businessStore.cancelAppointment(appointment.id)
    businessStore.fetchAppointments();
};

const addReview = (appointment) => {
    router.push({ name: 'business-details', params: { id: appointment.service.id } });
};

onMounted(async () => {
    await businessStore.fetchAppointments();
});

const getGoogleCalendarLink = (appointment) => {
    if (!appointment.start || !appointment.end) return '#';

    const start = new Date(appointment.start)
        .toISOString()
        .replace(/-|:|\.\d+/g, '');
    const end = new Date(appointment.end)
        .toISOString()
        .replace(/-|:|\.\d+/g, '');

    const title = encodeURIComponent(`${appointment.service_item.name} w ${appointment.service.name}`);
    const details = encodeURIComponent(appointment.service_item.description || '');
    const location = encodeURIComponent(appointment.service.location || '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

</script>

<style scoped>
.bookings-page {
    min-height: 100vh;
    padding: 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px 0;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto;
}

.bookings-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.bookings-section {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.badge-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.section-icon {
    font-size: 1.8rem;
    opacity: 0.8;
}

.appointments-list {
    padding: 10px;
}

.appointment-card {
    border-radius: 12px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    margin: 15px;
    padding: 20px;
    background: rgb(245, 245, 245);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #3498db;
    transition: all 0.3s ease;
}

.appointment-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.appointment-card.confirmed {
    border-left-color: #ecf000;
}

.appointment-card.anulowana {
    border-left-color: #e74c3c;
}

.appointment-card.zakończona {
    border-left-color: #2ecc71;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.appointment-info {
    flex: 1;
}

.service-name {
    font-size: 1.2rem;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 8px 0;
}

.service-item {
    color: #7f8c8d;
    text-align: left;
    margin: 0 0 15px 0;
    font-size: 0.95rem;
}

.appointment-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #5d6d7e;
    font-size: 0.9rem;
}

.detail-item i {
    color: #3498db;
    width: 16px;
}

.appointment-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-badge.confirmed {
    background: #e8f6ef;
    color: #2ecc71;
}

.status-badge.anulowana {
    background: #fdedec;
    color: #e74c3c;
}

.status-badge.zakończona {
    background: #2ecc703a;
    color: #2ecc71;
}

.action-button {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 8px;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s;
}

.action-button:hover {
    background: #e9ecef;
    color: #495057;
}

.card-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f1f2f6;
    justify-content: flex-end;
}

.secondary-button,
.cancel-button,
.review-button {
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.2s;
}

.secondary-button {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
}

.secondary-button:hover {
    background: #e9ecef;
}

.cancel-button {
    background: #fff5f5;
    border: 1px solid #f8d7da;
    color: #e74c3c;
}

.cancel-button:hover {
    background: #f8d7da;
}

.review-button {
    background: #fffaf0;
    border: 1px solid #ffeaa7;
    color: #f39c12;
}

.review-button:hover {
    background: #ffeaa7;
}

.card-footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f1f2f6;
    display: flex;
    justify-content: flex-end;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #bdc3c7;
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.5;
}

.empty-state h3 {
    color: #7f8c8d;
    margin: 0 0 10px 0;
}

.empty-state p {
    margin: 0;
}

@media (max-width: 768px) {
    .bookings-page {
        padding: 15px;
    }

    .page-title {
        font-size: 2rem;
    }

    .card-content {
        flex-direction: column;
        gap: 15px;
    }

    .appointment-status {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .card-actions {
        flex-direction: column;
    }
}
</style>
import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';
import router from '../router';
import Swal from 'sweetalert2';
import { icon } from 'leaflet';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    myBusiness: null,
    selectedBusiness: null,
    businesses: [],
    serviceItems: [],
    categories: [],
    isLoading: false,
    message: null,
    selectedServiceItem: null,
    availableSlots: [],
    serviceReviews: {
      reviews: [],
      average_rating: 0,
      ratings_breakdown: [0, 0, 0, 0, 0],
      total: 0
    },
    favorites: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
    },
  }),

  actions: {

    // BUSINESS -------------------------

    async registerBusiness(formData) {
      this.isLoading = true;
      try {
        const res = await axiosPreset.post('/business-add', formData);
        showAlert({ icon: 'success', title: 'Twój biznes został pomyślnie zarejestrowany!' });
        router.push('/my-business');
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zarejestrować biznesu' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMyBusiness() {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get('/my-business');
        this.myBusiness = res.data.business;
        this.selectedBusiness = res.data.business;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać Twojej usługi' });
        router.push('/settings');
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updateBusiness(id, formData) {
      this.isLoading = true;
      try {
        const res = await axiosPreset.post(`/business-update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showAlert({ icon: 'success', title: 'Biznes został zaktualizowany!' });
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zaktualizować biznesu' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllBusinesses(page = 1, category = '', search = '') {
      this.isLoading = true;
      try {
        const params = {
          page: page,
          ...(category && { category: category }),
          ...(search && { search: search })
        };

        const res = await axiosPreset.get('/businesses-all', { params: params });
        this.businesses = res.data.data;
        this.pagination.current_page = res.data.current_page;
        this.pagination.last_page = res.data.last_page;
        this.pagination.total = res.data.total;

      } catch (err) {
        showAlert({ icon: 'error', title: 'Wystąpił błąd podczas pobierania usług' });
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchBusinessById(id) {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get(`/business/${id}`);
        this.selectedBusiness = res.data.business;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie znaleziono usługi' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteMyBusiness() {
      const confirmation = await Swal.fire({
        title: 'Czy na pewno chcesz usunąć swój biznes?',
        text: 'Tej operacji nie można cofnąć!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tak, usuń!',
        cancelButtonText: 'Nie, anuluj',
        reverseButtons: true,
        background: '#414e66',
        color: '#fff',
        confirmButtonColor: '#d33',
        cancelButtonColor: '$primary',
      });

      if (confirmation.isConfirmed) {
        this.isLoading = true;
        try {
          const id = this.myBusiness.id;
          const res = await axiosPreset.delete(`/business-delete/${id}`);
          showAlert({ icon: 'success', title: 'Biznes został pomyślnie usunięty!' });
          router.push('/settings');
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się usunąć biznesu' });
          throw err.response?.data;
        } finally {
          this.isLoading = false;
        }
      } else {
        showAlert({ icon: 'info', title: 'Usunięcie anulowane' });
      }
    },

    // SERVICES -------------------------

    async fetchServices() {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get(`/service-items/${this.selectedBusiness.id}`);
        this.serviceItems = res.data.services;
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać usług' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async addService(formData) {
      this.isLoading = true;
      try {
        if (!formData.name || !formData.price || !formData.description || !formData.duration) {
          showAlert({ icon: 'warning', title: 'Wszystkie pola są wymagane!' });
          return;
        }

        const res = await axiosPreset.post('/service-item-add', formData);
        await this.fetchServices();
        showAlert({ icon: 'success', title: 'Usługa została pomyślnie dodana!' });
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się dodać usługi' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteService(id) {
      const confirmation = await Swal.fire({
        title: 'Czy na pewno chcesz usunąć usługę?',
        text: 'Tej operacji nie można cofnąć!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Tak, usuń!',
        cancelButtonText: 'Nie, anuluj',
        reverseButtons: true,
        background: '#414e66',
        color: '#fff',
        confirmButtonColor: '#d33',
        cancelButtonColor: '$primary',
      });

      if (confirmation.isConfirmed) {
        this.isLoading = true;
        try {
          const res = await axiosPreset.delete(`/service-item-delete/${id}`);
          await this.fetchServices();
          showAlert({ icon: 'success', title: 'Usługa została pomyślnie usunięta!' });
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się usunąć usługi' });
          throw err.response?.data;
        } finally {
          this.isLoading = false;
        }
      } else {
        showAlert({ icon: 'info', title: 'Usunięcie anulowane' });
        return;
      }
    },

    // REVIEWS -------------------------

    async fetchReviews(page = 1, rating) {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get(`/service-reviews/${this.selectedBusiness.id}?page=${page}&rating=${rating}`);
        this.serviceReviews = res.data;
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać opinii' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async addReview(formDataRef) {
      this.isLoading = true;
      try {
        const formData = { ...formDataRef.value };
        formData.service_id = this.selectedBusiness.id;
        if (!formData.rating || !formData.content) {
          showAlert({ icon: 'warning', title: 'Wszystkie pola są wymagane!' });
          return;
        }

        const res = await axiosPreset.post('/reviews-add', formData);
        await this.fetchReviews();
        showAlert({ icon: 'success', title: 'Opinia została pomyślnie dodana!' });
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się dodać opinii' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    async editReview(formDataRef) {
      this.isLoading = true;
      try {
        const formData = { ...formDataRef.value };
        if (!formData.rating || !formData.content) {
          showAlert({ icon: 'warning', title: 'Wszystkie pola są wymagane!' });
          return;
        }

        const res = await axiosPreset.put(`/reviews-update/${formData.id}`, formData);
        await this.fetchReviews();
        showAlert({ icon: 'success', title: 'Opinia została pomyślnie zaaktualizowana!' });
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zaaktualizować opinii' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },

    // FAVORITES -------------------------

    async fetchFavorites() {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get('/favorites');
        this.favorites = res.data;
        console.log('Wszystkie ulubione', res.data);
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać ulubionych usług' })
        throw err.response?.data
      } finally {
        this.isLoading = false;
      }
    },

    async toggleFavorite(id) {
      try {
        const res = await axiosPreset.post(`/favorites/${id}/toggle`);
        if (res.data.favorited === true) {
          showAlert({ icon: 'success', title: 'Dodano do ulubionych' });
        } else {
          showAlert({ icon: 'success', title: 'Usunięto z ulubionych' });
        }
        this.isFavorited(id);
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Coś poszło nie tak' });
        throw err.response?.data;
      }
    },

    async isFavorited(id) {
      try {
        const res = await axiosPreset.get(`/favorites/${id}/is-favorite`);
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Coś poszło nie tak' })
      }
    },

    // Categories -------------------------

    async fetchCategories() {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get('/categories');
        this.categories = res.data.categories;
        console.log('Kategorie', this.categories);
        return res.data.categories;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać kategorii' });
        throw err.response?.data;
      } finally {
        this.isLoading = false;
      }
    },
    // Appointments -------------------------

    setSelectedServiceItem(item) {
      this.selectedServiceItem = item
      console.log('Wybrana usługa', this.selectedServiceItem)
    },

    async fetchAppointmentsSlots(serviceId, date) {
      this.isLoading = true;
      try {
        const res = await axiosPreset.get(`/appointments/slots/${serviceId}`, {
          params: {
            date,
            service_item_id: serviceId,
          }
        });

        if (Array.isArray(res.data.available_slots)) {
          this.availableSlots = res.data.available_slots;
          this.message = null;
        } else {
          this.availableSlots = [];
          this.message = res.data.message || 'Brak dostępnych terminów';
        }

        console.log('Dostępne terminy', this.availableSlots);
        return res.data;
      } catch (err) {
        showAlert({
          icon: 'error',
          title: 'Nie udało się pobrać dostępnych terminów'
        });
      } finally {
        this.isLoading = false;
      }
    },

    async storeAppointment(serviceItemId, startDateTime) {
      try {
        const authStore = useAuthStore()

        if (!authStore.isLoggedIn) {
          showAlert({ icon: 'error', title: 'Musisz się wpierw zalogować aby umówić wizytę.' });
          return
        } else {
          const response = await axiosPreset.post('/appointments', {
            service_item_id: serviceItemId,
            start: startDateTime
          })
          showAlert({ icon: 'success', title: 'Potwierdzono wizytę!' });
          router.push(`/business/${this.selectedBusiness.id}`);
          return response.data
        }
      } catch (err) {
        showAlert({ icon: 'error', title: 'Coś poszło nie tak podczas umawiania wizyty' });
      }
    }
  },
});


export const showAlert = ({ icon = 'info', title = '' }) => {
  Swal.fire({
    icon,
    title,
    text: '',
    timer: 2000,
    toast: false,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    timerProgressBar: true,
    background: '#414e66',
    color: '#fff',
    customClass: {
      confirmButton: 'my-confirm-button'
    }
  });
};
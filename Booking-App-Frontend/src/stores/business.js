import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';
import router from '../router';
import Swal from 'sweetalert2';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    myBusiness: null,
    selectedBusiness: null,
    serviceItems: [],
    serviceReviews: {
      reviews: [],
      average_rating: 0,
      ratings_breakdown: [0, 0, 0, 0, 0],
      total: 0
    },
  }),

  actions: {
    async registerBusiness(formData) {
      try {
        const res = await axiosPreset.post('/business-add', formData);
        showAlert({ icon: 'success', title: 'Twój biznes został pomyślnie zarejestrowany!' });
        router.push('/my-business');
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zarejestrować biznesu' });
        throw err.response?.data;
      }
    },

    async fetchMyBusiness() {
      try {
        const res = await axiosPreset.get('/my-business');
        this.myBusiness = res.data.business;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać Twojej usługi' });
        router.push('/settings');
        throw err.response?.data;
      }
    },

    async fetchBusinessById(id) {
      try {
        const res = await axiosPreset.get(`/business/${id}`);
        this.selectedBusiness = res.data.business;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie znaleziono usługi' });
        throw err.response?.data;
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
        try {
          const id = this.myBusiness.id;
          const res = await axiosPreset.delete(`/business-delete/${id}`);
          showAlert({ icon: 'success', title: 'Biznes został pomyślnie usunięty!' });
          router.push('/settings');
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się usunąć biznesu' });
          throw err.response?.data;
        }
      } else {
        showAlert({ icon: 'info', title: 'Usunięcie anulowane' });
      }
    },

    async fetchServices() {
      try {
        const res = await axiosPreset.get('/service-items');
        this.serviceItems = res.data.services;
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać usług' });
        throw err.response?.data;
      }
    },

    async addService(formData) {
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
        try {
          const res = await axiosPreset.delete(`/service-item-delete/${id}`);
          await this.fetchServices();
          showAlert({ icon: 'success', title: 'Usługa została pomyślnie usunięta!' });
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się usunąć usługi' });
          throw err.response?.data;
        }
      } else {
        showAlert({ icon: 'info', title: 'Usunięcie anulowane' });
        return;
      }
    },

    async fetchReviews(page = 1, rating) {
      try {
        const res = await axiosPreset.get(`/service-reviews/${this.myBusiness.id}?page=${page}&rating=${rating}`);
        this.serviceReviews = res.data;
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać opinii' });
        throw err.response?.data;
      }
    },

    async addReview(formDataRef) {
      try {
        const formData = { ...formDataRef.value };
        formData.service_id = this.myBusiness.id;
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
      }
    },

    async editReview(formDataRef) {
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
      }
    },
  },
});

export const showAlert = ({ icon = 'info', title = '' }) => {
  Swal.fire({
    icon,
    title,
    text: '',
    timer: 1000,
    toast: false,
    showConfirmButton: false,
    timerProgressBar: true,
    background: '#414e66',
    color: '#fff',
  });
};
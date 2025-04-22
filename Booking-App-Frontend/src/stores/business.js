import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';
import router from '../router';
import Swal from 'sweetalert2';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    myService: null,
    selectedService: null,
  }),

  actions: {
    async registerBusiness(formData) {
      try {
        const res = await axiosPreset.post('/services-add', formData);
        showAlert({ icon: 'success', title: 'Twój biznes został pomyślnie zarejestrowany!' });
        router.push('/my-business');
        return res.data;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się zarejestrować biznesu' });
        throw err.response?.data;
      }
    },

    async fetchMyService() {
      try {
        const res = await axiosPreset.get('/my-service');
        this.myService = res.data.service;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie udało się pobrać Twojej usługi' });
        router.push('/settings');
        throw err.response?.data;
      }
    },

    async fetchServiceById(id) {
      try {
        const res = await axiosPreset.get(`/services/${id}`);
        this.selectedService = res.data.service;
      } catch (err) {
        showAlert({ icon: 'error', title: 'Nie znaleziono usługi' });
        throw err.response?.data;
      }
    },

    async deleteMyService() {
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
          const id = this.myService.id;
          const res = await axiosPreset.delete(`/services-delete/${id}`);
          showAlert({ icon: 'success', title: 'Usługa została pomyślnie usunięta!' });
          router.push('/settings');
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się usunąć usługi' });
          throw err.response?.data;
        }
      } else {
        showAlert({ icon: 'info', title: 'Usunięcie anulowane' });
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
    showConfirmButton: false,
    timerProgressBar: true,
    background: '#414e66',
    color: '#fff',
  });
};
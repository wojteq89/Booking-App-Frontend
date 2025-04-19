import { defineStore } from 'pinia';
import axiosPreset from '../axiosPreset';
import router from '../router';
import Swal from 'sweetalert2'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    
  }),

  actions: {
    async registerBusiness(formData) {
        try {
          const res = await axiosPreset.post('/services-add', formData);
          showAlert({ icon: 'success', title: 'Zarejestrowano twój biznes pomyślnie!',})
          router.push('/settings'); // przeniesienie może do zakładki z usługami
          return res.data;
        } catch (err) {
          showAlert({ icon: 'error', title: 'Nie udało się zarejestrować biznesu',})
          throw err.response.data;
        }
      },
  },
});

export const showAlert = ({ icon = 'info', title = ''}) => {
  Swal.fire({
    icon,
    title,
    text: "",
    timer: 2000,
    toast: false,
    showConfirmButton: false,
    timerProgressBar: true,
    background: '#414e66',
    color: '#fff',
  })
}

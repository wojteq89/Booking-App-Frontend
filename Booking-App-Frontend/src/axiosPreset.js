import axios from 'axios';

const axiosPreset = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    //'Content-Type': 'application/json',
    'Content-Type': undefined
  },
});

axiosPreset.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosPreset;

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'
import AppLogo from '@/components/common/AppLogo.vue'
import 'leaflet/dist/leaflet.css';

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)
app.use(pinia)
app.use(router)

app.component('AppLogo', AppLogo)
app.mount('#app')

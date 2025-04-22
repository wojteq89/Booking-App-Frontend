import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/auth/LoginPage.vue'
import RegisterPage from '@/components/auth/RegisterPage.vue'
import SettingsComp from '@/components/settings/SettingsComp.vue'
import HomePage from '@/components/homePage/HomePage.vue'
import AddBusinessForm from '@/components/forms/AddBusinessForm.vue'
import BussinesDetailsPage from '@/components/bussines/BussinesDetailsPage.vue'

const routes = [
  { path: '/settings', component: SettingsComp },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/home', component: HomePage },
  { path: '/add-business-form', component: AddBusinessForm },
  { path: '/my-business', component: BussinesDetailsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

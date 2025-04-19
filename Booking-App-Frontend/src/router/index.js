import { createRouter, createWebHistory } from 'vue-router'
import LoginComp from '@/components/auth/LoginComp.vue'
import RegisterComp from '@/components/auth/RegisterComp.vue'
import SettingsComp from '@/components/settings/SettingsComp.vue'
import HomeComp from '@/components/homePage/HomePage.vue'
import AddBusinessForm from '@/components/forms/AddBusinessForm.vue'

const routes = [
  { path: '/settings', component: SettingsComp },
  { path: '/login', component: LoginComp },
  { path: '/register', component: RegisterComp },
  { path: '/home', component: HomeComp },
  { path: '/add-business-form', component: AddBusinessForm },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

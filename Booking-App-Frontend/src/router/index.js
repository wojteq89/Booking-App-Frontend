import { createRouter, createWebHistory } from 'vue-router'
import LoginComp from '@/components/Auth/LoginComp.vue'
import RegisterComp from '@/components/Auth/RegisterComp.vue'
import MainComp from '@/components/MainComp.vue'

const routes = [
  { path: '/', component: MainComp },
  { path: '/login', component: LoginComp },
  { path: '/register', component: RegisterComp },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

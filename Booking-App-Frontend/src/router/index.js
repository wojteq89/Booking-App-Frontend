import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/auth/LoginPage.vue'
import RegisterPage from '@/components/auth/RegisterPage.vue'
import SettingsComp from '@/components/settings/SettingsComp.vue'
import HomePage from '@/components/homePage/HomePage.vue'
import AddBusinessForm from '@/components/forms/AddBusinessForm.vue'
import BussinesDetailsPage from '@/components/bussines/BussinesDetailsPage.vue'
import ResetPasswordPage from '../components/auth/ResetPasswordPage.vue'
import FavoritesListPage from '../components/favorites/FavoritesListPage.vue'
import BrowsePage from '@/components/browsingPage/browsePage.vue'
import TestPage from '@/components/testPages/testPage.vue'
import VerifyEmailPage from '../components/auth/VerifyEmailPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/browse-page', component: BrowsePage },
  { path: '/settings', component: SettingsComp },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/add-business-form', component: AddBusinessForm },
  { path: '/my-business', component: BussinesDetailsPage, name: 'my-business' },
  {
    path: '/business/:id', component: BussinesDetailsPage,
    name: 'business-details',
    props: true
  },
  { path: '/reset-password', component: ResetPasswordPage },
  { path: '/favorites', component: FavoritesListPage },
  { path: '/test-page', component: TestPage },
  { path: '/verify-email', component: VerifyEmailPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

export default router
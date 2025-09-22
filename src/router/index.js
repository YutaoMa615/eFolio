import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from '../views/HomeViews.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import AddBookView from '@/views/AddBookView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'

const routes = [
  {
    path: '/Homeviews',
    name: 'Homeviews',
    component: HomeViews
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/Authentication.vue'
import SignUp from '@/views/SignUp.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/Authentication.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUp.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const publicPages = ['/signin', '/signup']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !isAuthenticated) {
    next({ name: 'signin' })
  } else {
    next()
  }
})

export default router

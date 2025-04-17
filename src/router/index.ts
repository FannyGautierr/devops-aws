import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import { getCurrentUser} from 'aws-amplify/auth';
import SignUp from '@/views/SignUp.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    }
  ],
})


router.beforeEach(async (to, from, next) => {
  const publicPages = ['/signup']
  const authRequired = !publicPages.includes(to.path)

  try {
    const user = await getCurrentUser()
    console.log('Authenticated user:', user)

    if (authRequired && !user) {
      next({ name: 'signup' })
    } else {
      next()
    }
  } catch (err) {
    console.log('Error checking authentication:', err)

    if (authRequired) {
      next({ name: 'signup' })
    } else {
      next()
    }
  }
})

export default router

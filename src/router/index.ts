import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import { getCurrentUser} from 'aws-amplify/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUp.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    }
  ],
})

// router.beforeEach(async(to, from, next) => {
//   const { username, userId, signInDetails } = await getCurrentUser();

//   const publicPages = ['/signup']
//   const authRequired = !publicPages.includes(to.path)
//   console.log('authRequired', authRequired)
//   console.log('signInDetails', signInDetails)
//   if (authRequired && !signInDetails) {
//     next({ name: 'signup' })
//   } else {
//     next()
//   }
// })

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/signup']
  const authRequired = !publicPages.includes(to.path)

  try {
    // Check if the user is authenticated
    const user = await getCurrentUser()
    console.log('Authenticated user:', user)

    if (authRequired && !user) {
      // Redirect to signup if authentication is required and no user is logged in
      next({ name: 'signup' })
    } else {
      // Allow access to the route
      next()
    }
  } catch (err) {
    console.log('Error checking authentication:', err)

    if (authRequired) {
      // Redirect to signup if authentication is required and an error occurs
      next({ name: 'signup' })
    } else {
      // Allow access to public pages
      next()
    }
  }
})

export default router

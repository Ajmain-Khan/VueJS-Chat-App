import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import ChatView from '../views/ChatView.vue'
import TempChatView from '../views/TempChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: TempChatView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((view) => view.meta.requiresAuth)
  let userSession = JSON.parse(localStorage.getItem('userSession'))

  if (requiresAuth) {
    // If path requires authorization
    if (userSession && userSession.isLoggedIn) {
      // Check if user is logged in
      next() // Allow access to the route
    } else {
      next('/') // Redirect to the home page if the user is not logged in
    }
  } else {
    next() // Allow access to the route if it doesn't required authentication
  }
})

export default router

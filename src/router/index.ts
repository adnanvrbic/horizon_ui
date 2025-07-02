import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../store/auth'
import Login from '@/pages/login.vue'
import Index from '@/pages/index.vue'
import SecondPage from '@/pages/second-page.vue'
import Default from '@/layouts/default.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'root',
    component: Default,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Index,
      },
      {
        path: 'second-page',
        name: 'second-page',
        component: SecondPage,
      },
      {
        path: '',
        redirect: '/home',
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/home',
  },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to) {
      if (to.hash)
        return { el: to.hash, behavior: 'smooth', top: 60 }
  
      return { top: 0 }
    },
  })

  router.beforeEach((to, from, next) => {
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
  
    const loggedIn = isAuthenticated()
  
    if (authRequired && !loggedIn) {
      return next('/login')
    }
  
    next()
  })
  
  
  export { router }

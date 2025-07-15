import { createApp } from 'vue'

import App from '@/App.vue'
import axios from 'axios'
import { registerPlugins } from '@core/utils/plugins'
import { removeToken } from './store/auth'
import { router } from './router'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
  
axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        removeToken()
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login')
        }
      }
      return Promise.reject(error)
    }
  )
  
const app = createApp(App)

app.use(router)

registerPlugins(app)

app.mount('#app')

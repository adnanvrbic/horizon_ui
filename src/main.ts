import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { isAuthenticated, removeToken } from './store/auth'
import { router } from './router'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
  
  setInterval(() => {
    if (!isAuthenticated()) {
      removeToken()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
  }, 60000)
  
const app = createApp(App)

app.use(router)

registerPlugins(app)

app.mount('#app')

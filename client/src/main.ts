import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import '@/assets/scss/tailwind.scss'
import '@/assets/scss/app.scss'

import { createHead } from '@vueuse/head'

import Toast from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

const startApp = () => {
  const head = createHead()
  const app = createApp(App)

  app.use(router)

  /**
   * Plugins
   */

  app.use(head)

  app.use(Toast, {
    // TODO: modify options
  })

  // Mount app
  app.mount('#app')
}

startApp()

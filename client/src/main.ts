import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import '@/assets/scss/tailwind.scss'
import '@/assets/scss/app.scss'

import { createHead } from '@vueuse/head'

// import '@/assets/styles/tailwind.scss'

const startApp = () => {
  const head = createHead()
  const app = createApp(App)

  app.use(router)

  /**
   * Plugins
   */

  app.use(head)

  // Mount app
  app.mount('#app')
}

startApp()

import { createWebHistory, createRouter } from 'vue-router'
import Home from '@/pages/Home.vue'
import NotFound from '@/pages/NotFound.vue'
import Privacy from '@/pages/Privacy.vue'
import Callback from '@/pages/Callback.vue'

const routes = [
  {
    path: '/',
    alias: ['/home'],
    name: 'home',
    component: Home,
  },
  {
    name: 'not-found',
    path: '/not-found',
    component: NotFound,
  },
  {
    name: 'callback',
    path: '/callback',
    component: Callback,
  },
  {
    name: 'privacy',
    path: '/privacy',
    component: Privacy,
  },

  // otherwise redirect to 404
  { path: '/:pathMatch(.*)*', redirect: '/not-found' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return setTimeout(() => {
          if (savedPosition) {
            resolve(window.scrollTo({ top: savedPosition.top }))
          } else {
            resolve()
          }
        }, 500)
      }
      if (to.hash) {
        const element = document.querySelector(to.hash) as HTMLElement
        resolve(
          window.scrollTo({
            top: element ? element.offsetTop : 0,
          })
        )
      }
      resolve(window.scrollTo({ top: 0 }))
    })
  },
})

export default router

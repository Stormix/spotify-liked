<template>
  <app-layout class="w-screen h-screen">
    <router-view :key="route.path" />
  </app-layout>
</template>

<script lang="ts">
  import { defineComponent, State } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useStore } from 'vuex'
  import AppLayout from './components/layout/AppLayout.vue'
  import setupCookieConsent from './utils/cookieconsent.utils'

  export default defineComponent({
    name: 'App',
    components: {
      AppLayout,
    },
    setup() {
      const route = useRoute()
      const store = useStore<State>()
      const toast = useToast()
      setupCookieConsent()

      store.dispatch('userStore/fetch')
      store.dispatch('userStore/fetchTracks').catch((err) => {
        if (err.response.status === 400) {
          toast.error(
            'Failed to fetch liked tracks, maybe try logging out and in again?'
          )
        }
      })

      return {
        route,
      }
    },
  })
</script>

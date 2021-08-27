<template>
  <app-layout class="w-screen h-screen">
    <router-view :key="route.path" />
  </app-layout>
</template>

<script lang="ts">
  import { defineComponent, State } from 'vue'
  import { useRoute } from 'vue-router'
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
      setupCookieConsent()

      store.dispatch('userStore/fetch')

      return {
        route,
      }
    },
  })
</script>

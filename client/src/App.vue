<template>
  <app-layout class="w-screen h-screen">
    <router-view :key="route.path" />
  </app-layout>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useRoute } from 'vue-router'
  import AppLayout from './components/layout/AppLayout.vue'
  import setupCookieConsent from './utils/cookieconsent.utils'

  export default defineComponent({
    name: 'App',
    components: {
      AppLayout,
    },
    setup() {
      const route = useRoute()
      setupCookieConsent()

      return {
        route,
      }
    },
  })
</script>

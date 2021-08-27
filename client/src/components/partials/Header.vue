<template>
  <header>
    <Navbar />
    <slot />
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Navbar from './Navbar.vue'
  export default defineComponent({
    components: {
      Navbar,
    },
    setup() {
      return {}
    },
  })
</script>

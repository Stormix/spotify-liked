<template>
  <div class="flex flex-col">
    <Header />
    <main class="flex-grow">
      <div class="h-full rounded-lg shadow bg-base-200 drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="flex flex-col items-center justify-center drawer-content">
          <slot />
        </div>
        <div class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul
            class="p-4 overflow-y-auto menu w-80 bg-base-100 text-base-content"
          >
            <li><router-link to="home"> Home </router-link></li>
            <li><router-link to="privacy"> Privacy </router-link></li>
            <li><router-link to="contact"> Contact </router-link></li>
          </ul>
        </div>
      </div>
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Footer from '../partials/Footer.vue'
  import Header from '../partials/Header.vue'

  export default defineComponent({
    components: { Header, Footer },
    setup() {
      return {}
    },
  })
</script>

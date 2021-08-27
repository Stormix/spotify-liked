<template>
  <div
    class="mb-2 shadow-lg navbar bg-neutral text-neutral-content rounded-box"
  >
    <div>
      <label for="my-drawer" class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>
    </div>
    <div class="flex-none px-2 mx-2">
      <span class="text-lg font-bold"> Spotify Liked </span>
    </div>
    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
        <router-link to="home" class="btn btn-ghost btn-sm rounded-btn">
          Home
        </router-link>
        <router-link to="privacy" class="btn btn-ghost btn-sm rounded-btn">
          Privacy
        </router-link>
        <router-link to="contact" class="btn btn-ghost btn-sm rounded-btn">
          Contact
        </router-link>
      </div>
    </div>
    <div class="flex-none">
      <div class="avatar">
        <div class="w-10 h-10 m-1 rounded-full">
          <img src="https://i.pravatar.cc/500?img=32" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      return {}
    },
  })
</script>

<template>
  <div class="shadow-lg navbar bg-neutral text-neutral-content">
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
    <div v-if="user" class="flex-none">
      <div class="flex items-center">
        <p class="mr-2">
          Logged in as
          <span class="text-primary">{{ user.displayName }}</span>
        </p>
        <div class="dropdown dropdown-end">
          <div tabindex="0" class="m-1">
            <div class="cursor-pointer avatar">
              <div class="w-10 h-10 m-1 rounded-full">
                <img :src="user?.imageUrl" />
              </div>
            </div>
          </div>
          <ul
            tabindex="0"
            class="p-2 shadow  menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end" title="Change Theme">
        <div tabindex="0" class="m-1 normal-case btn-ghost btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current md:mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <span class="hidden md:inline"> Change Theme </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-4 h-4 ml-1 fill-current"
            viewBox="0 0 1792 1792"
          >
            <path
              d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"
            />
          </svg>
        </div>
        <div
          class="mt-16 overflow-y-auto shadow-2xl  top-px dropdown-content h-96 w-52 rounded-b-box bg-base-200 text-base-content"
        >
          <ul class="p-4 menu compact">
            <li v-for="theme in themes" :key="theme.id">
              <a
                tabindex="0"
                :data-set-theme="theme.id"
                data-act-class="active"
              >
                {{ theme.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue'
  import { useAuth } from '../../utils/auth.utils'
  import { themeChange } from 'theme-change'

  export default defineComponent({
    setup() {
      const { user, logout } = useAuth()
      const themes = [
        { id: 'light', name: '🌝  light' },
        { id: 'dark', name: '🌚  dark' },
        { id: 'cupcake', name: '🧁  cupcake' },
        { id: 'bumblebee', name: '🐝  bumblebee' },
        { id: 'emerald', name: '✳️  Emerald' },
        { id: 'corporate', name: '🏢  Corporate' },
        { id: 'synthwave', name: '🌃  synthwave' },
        { id: 'retro', name: '👴  retro' },
        { id: 'cyberpunk', name: '🤖  cyberpunk' },
        { id: 'valentine', name: '🌸  valentine' },
        { id: 'halloween', name: '🎃  halloween' },
        { id: 'garden', name: '🌷  garden' },
        { id: 'forest', name: '🌲  forest' },
        { id: 'aqua', name: '🐟  aqua' },
        { id: 'lofi', name: '👓  lofi' },
        { id: 'pastel', name: '🖍  pastel' },
        { id: 'fantasy', name: '🧚‍♀️  fantasy' },
        { id: 'wireframe', name: '📝  Wireframe' },
        { id: 'black', name: '🏴  black' },
        { id: 'luxury', name: '💎  luxury' },
        { id: 'dracula', name: '🧛‍♂️  dracula' },
      ]

      onMounted(() => {
        themeChange('dracula')
      })

      return {
        user,
        logout,
        themes,
      }
    },
  })
</script>

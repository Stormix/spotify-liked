<template>
  <div v-if="!user" class="flex h-full">
    <div class="py-6 my-auto hero bg-base-200">
      <div class="text-center hero-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
          <p class="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <div data-tip="Login with your spotify account" class="tooltip">
            <button
              class="btn btn-primary btn-xs md:btn-sm lg:btn-md xl:btn-lg"
              @click="login"
            >
              Login with spotify
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="py-4">
    <div v-if="!loading" class="w-full shadow stats">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Liked Songs</div>
        <div class="stat-value text-primary">{{ tracks.length }}</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Duration</div>
        <div class="stat-value text-info">
          {{ customFormatDuration({ start: 0, end: totalDuration }) }}
        </div>
      </div>
    </div>
    <div class="my-4">
      <h3 class="mb-2 text-2xl font-bold">Liked songs:</h3>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, State } from 'vue'
  import API from '@/providers/api'
  import { useToast } from 'vue-toastification'
  import { useAuth } from '../utils/auth.utils'
  import { useStore } from 'vuex'
  import { customFormatDuration } from '../utils/time.utils'
  export default defineComponent({
    setup() {
      const toast = useToast()
      const { user } = useAuth()
      const store = useStore<State>()
      const loading = computed(() => store.state.userStore.loading)
      const tracks = computed(() => {
        return store.state.userStore.tracks
      })

      const totalDuration = computed(() => {
        if (!tracks.value) return 0
        return tracks.value.reduce((acc, track) => {
          return acc + track?.track?.duration_ms ?? 0
        }, 0)
      })

      const login = async () => {
        try {
          const response = await API.execute('POST', 'users/spotify', {})

          if (response.status === 200) {
            window.location.href = response.data.redirect_url
            return
          }
        } catch (error) {
          console.info('API error: ', error)
          toast.error('Something went wrong!')
        }
      }

      return {
        login,
        user,
        tracks,
        totalDuration,
        loading,
        customFormatDuration,
      }
    },
  })
</script>

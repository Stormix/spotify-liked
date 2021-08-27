<template>
  <div class="flex w-full h-full">
    <div class="w-full">
      <div class="hero bg-base-200">
        <div class="text-center hero-content">
          <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
            <p class="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
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
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import API from '@/providers/api'
  import { useToast } from 'vue-toastification'

  export default defineComponent({
    setup() {
      const toast = useToast()

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
      return { login }
    },
  })
</script>

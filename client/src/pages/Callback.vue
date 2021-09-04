<template>
  <div>Please wait while we redirect you back to the homepage.</div>
  <div>
    <router-link to="home" class="btn btn-primary">Go home</router-link>
  </div>
</template>

<script lang="ts">
  import { env } from 'process'
  import { defineComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useStore } from 'vuex'
  import { cookieName } from '../config/auth.config'
  import api from '../providers/api'
  import cookiesUtils from '../utils/cookies.utils'
  import { persist } from '../utils/persist.utils'
  export default defineComponent({
    setup() {
      const toast = useToast()
      const route = useRoute()
      const router = useRouter()
      const store = useStore()
      const code = route.query.code

      if (!code) {
        toast.error('No code provided, please try again!')
        return
      }
      const redirect = () => {
        router.push({
          name: 'home',
        })
      }

      const checkIfAlreadyLoggedIn = async () => {
        const token = await cookiesUtils.get(cookieName)
        if (token) {
          redirect()
        }
      }

      const saveAuthCode = async () => {
        try {
          const reponse = await api.execute('POST', 'users/auth', {
            code,
          })

          if (reponse.status === 200) {
            const { token, expiresIn } = reponse.data

            await persist(cookieName, token, expiresIn)
            toast.success('Successfully logged in!')
            store.dispatch('userStore/fetch')
            store.dispatch('userStore/fetchTracks')
            return redirect()
          }
        } catch (error) {
          toast.error('Something went wrong: ' + error.message)
        }
      }
      checkIfAlreadyLoggedIn()
      saveAuthCode()
      return {}
    },
  })
</script>

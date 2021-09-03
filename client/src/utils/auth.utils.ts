import { computed, State } from 'vue'
import router from '../router'
import cookiesUtils from './cookies.utils'
import { cookieName } from '../config/auth.config'
import { useStore } from 'vuex'

export const useAuth = () => {
  const getToken = () => {
    return (
      cookiesUtils.get(cookieName) || window.localStorage.getItem(cookieName)
    )
  }

  const localToken = getToken()
  const store = useStore<State>()
  const isAuthenticated = !!localToken
  const user = computed(() => {
    return store.state.userStore.user
  })
  const loading = computed(() => {
    return store.state.userStore.loading
  })

  const isLoggedIn = computed(() => !!user.value)

  const userAvatar = computed(() => {
    const avatar = user.value?.imageUrl ?? '/default.png'
    return avatar
  })

  const logout = async () => {
    await store.dispatch('userStore/logout')
    // this is on purpose
    window.location.replace(router.resolve({ name: 'home' }).fullPath)
  }

  return {
    user,
    loading,
    userAvatar,
    isAuthenticated,
    logout,
    isLoggedIn,
    getToken,
  }
}

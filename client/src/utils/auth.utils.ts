import { computed, State, toRefs } from 'vue'
import store from '../store'
import router from '../router'
import cookiesUtils from './cookies.utils'
import { cookieName } from '../config/auth.config'

export const useAuth = () => {
  const state = (store.state as State).userStore

  const getToken = () => {
    return (
      cookiesUtils.get(cookieName) || window.localStorage.getItem(cookieName)
    )
  }

  const localToken = getToken()

  const isAuthenticated = !!localToken

  const { user, loading } = toRefs(state)

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

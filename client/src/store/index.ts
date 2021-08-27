import { createStore, createLogger } from 'vuex'
import user from './user'

const debug = true // import.meta.env.PROD

export default createStore({
  modules: {
    userStore: user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

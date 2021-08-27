// vuex.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue'
import { CDN } from '@yogalive/core'
import { Store } from 'vuex'
import RootState from '../typings/RootState'

declare module '@vue/runtime-core' {
  // declare your own store states
  type State = RootState

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
    $cdn: CDN
  }
}

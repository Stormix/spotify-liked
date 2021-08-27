import { getters } from './getters'
import actions from './actions'
import mutations from './mutations'
import { BaseState } from '../../typings/BaseState'
import { IUser } from '../../interfaces/user.interface'
import { SpotifyLikedTrack } from '../../interfaces/SpotifyLikedTrack'

export const storeName = 'userStore'

export interface UserState extends BaseState {
  user: IUser | null
  tracks: SpotifyLikedTrack[]
}

const state: UserState = {
  user: null,
  tracks: [],
  loading: false,
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

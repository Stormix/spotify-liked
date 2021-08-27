import { UserState } from '.'
import { SpotifyLikedTrack } from '../../interfaces/SpotifyLikedTrack'
import { IUser } from '../../interfaces/user.interface'

const setLoading = (state: UserState, value: boolean): void => {
  state.loading = value
}

const setUser = (state: UserState, value: IUser): void => {
  state.user = value
}

const setTracks = (state: UserState, value: SpotifyLikedTrack[]): void => {
  state.tracks = value
}

export default {
  setLoading,
  setUser,
  setTracks,
}

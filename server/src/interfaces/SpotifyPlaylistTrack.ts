import { SpotifyTrack } from './SpotifyTrack'
import { SpotifyUser } from './SpotifyUser'

export interface SpotifyPlaylistTrack {
  added_at: string
  added_by: SpotifyUser
  is_local: boolean
  track: SpotifyTrack
}

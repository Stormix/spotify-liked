import { SpotifyImage } from './SpotifyImage'
import { SpotifyPagedResponse } from './SpotifyPagedResponse'
import { SpotifyPlaylistTrack } from './SpotifyPlaylistTrack'
import { SpotifyUser } from './SpotifyUser'

export interface SpotifyPlaylist {
  collaborative: boolean
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  owner: SpotifyUser
  public: boolean
  snapshot_id: string
  tracks: SpotifyPagedResponse<SpotifyPlaylistTrack>
  type: string
  uri: string
}

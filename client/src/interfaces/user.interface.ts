import { Playlist } from './playlist.interface'

export interface IUser {
  email: string
  spotifyId: string
  displayName: string
  imageUrl: string
  playlist: Playlist
}

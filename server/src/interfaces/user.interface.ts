import mongoose from 'mongoose'
import { Playlist } from './playlist.interface'
import { SpotifyTokens } from './SpotifyTokens'

export interface IUser extends mongoose.Document {
  email: string
  spotifyId: string
  tokens: SpotifyTokens
  displayName: string
  imageUrl: string
  playlist: Playlist
}

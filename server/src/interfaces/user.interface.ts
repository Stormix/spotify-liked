import mongoose from 'mongoose'
import { SpotifyTokens } from '../services/SpotifyTokens'

export interface IUser extends mongoose.Document {
  email: string
  spotifyId: string
  tokens: SpotifyTokens
  displayName: string
  imageUrl: string
}

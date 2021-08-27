import axios from 'axios'
import { spotifyClientID, spotifyClientSecret } from '../env'
import logger from '../utils/logger'

export interface SpotifyTokens {
  access_token: string
  token_type: string
  expires_in: number
  scope?: string
  refresh_token: string
}

export interface SpotifyImage {
  url: string
  width?: number
  height?: number
}

export interface SpotifyUser {
  display_name: string
  external_urls: {
    spotify: string
  }
  email: string
  href: string
  id: string
  type: string
  uri: string
  images: SpotifyImage[]
  product: string
}

export class SpotifyService {
  hostUrl: string

  tokens: SpotifyTokens

  public static login(origin: string) {
    const scopes = 'user-read-private user-read-email'
    const redirect_uri = `${origin}/callback`
    const endpoint = `https://accounts.spotify.com/authorize?client_id=${spotifyClientID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes}`

    return endpoint
  }

  public getApiInstance(tokens: SpotifyTokens) {
    this.tokens = tokens
    return axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 30 * 1000,
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })
  }

  public async getUserTokens(origin: string, code: string) {
    try {
      const redirect_uri = `${origin}/callback`
      const params = new URLSearchParams()
      params.append('grant_type', 'authorization_code')
      params.append('code', code)
      params.append('redirect_uri', redirect_uri)
      params.append('client_id', spotifyClientID)
      params.append('client_secret', spotifyClientSecret)

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const tokens = response.data as SpotifyTokens

      if (tokens) {
        return tokens
      }

      throw new Error('No tokens received')
    } catch (error) {
      logger.error(
        `Spotify client error: ${JSON.stringify(error.response.data)}`,
        error
      )
      return null
    }
  }

  public async getUserInfo(tokens?: SpotifyTokens) {
    try {
      if (!tokens) {
        throw new Error('No spotify tokens are set')
      }

      const api = this.getApiInstance(tokens)
      const response = await api.get('/me')

      return response.data as SpotifyUser
    } catch (error) {
      logger.error('Spotify client error: ', error)
      return null
    }
  }
}

export default new SpotifyService()

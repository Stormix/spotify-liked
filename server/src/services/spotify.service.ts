import axios from 'axios'
import { spotifyClientID, spotifyClientSecret } from '../env'
import { SpotifyLikedTrack } from '../interfaces/SpotifyLikedTrack'
import { SpotifyPagedResponse } from '../interfaces/SpotifyPagedResponse'
import { SpotifyTokens } from '../interfaces/SpotifyTokens'
import { SpotifyUser } from '../interfaces/SpotifyUser'
import logger from '../utils/logger'

export class SpotifyService {
  hostUrl: string

  tokens: SpotifyTokens

  public static login(origin: string) {
    const scopes = 'user-read-private user-read-email user-library-read'
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

  public async refreshToken(tokens: SpotifyTokens) {
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'refresh_token')
      params.append('refresh_token', tokens.refresh_token)

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const newTokenResponse = response.data as {
        access_token: string
        token_type: string
        expires_in: number
        scope?: string
      }

      if (newTokenResponse) {
        return {
          ...tokens,
          access_token: newTokenResponse.access_token
        }
      }

      throw new Error('Failed to refresh tokens')
    } catch (error) {
      logger.error('Failed to refresh tokens: ', error)
      return tokens
    }
  }

  public async getUserTracks(tokens: SpotifyTokens) {
    try {
      const api = this.getApiInstance(tokens)
      const response = await api.get('/me/tracks?offset=0&limit=20')
      const data = response.data as SpotifyPagedResponse<SpotifyLikedTrack>

      while (data.next) {
        const nextResponse = await api.get(data.next)
        const nextData =
          nextResponse.data as SpotifyPagedResponse<SpotifyLikedTrack>
        data.items = data.items.concat(nextData.items)
        data.next = nextData.next
      }

      return data
    } catch (error) {
      return null
    }
  }
}

export default new SpotifyService()

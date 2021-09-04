import axios, { AxiosResponse } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { spotifyClientID, spotifyClientSecret } from '../env'
import { SpotifyLikedTrack } from '../interfaces/SpotifyLikedTrack'
import { SpotifyPagedResponse } from '../interfaces/SpotifyPagedResponse'
import { SpotifyPlaylistTrack } from '../interfaces/SpotifyPlaylistTrack'
import { SpotifyTokens } from '../interfaces/SpotifyTokens'
import { SpotifyTrack } from '../interfaces/SpotifyTrack'
import { SpotifyUser } from '../interfaces/SpotifyUser'
import { IUser } from '../interfaces/user.interface'
import userModel from '../models/user.model'
import { asyncForEach, chunk } from '../utils/array.utils'
import logger from '../utils/logger'

export class SpotifyService {
  hostUrl: string

  public static login(origin: string) {
    const scopes =
      'user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private playlist-read-private'
    const redirect_uri = `${origin}/callback`
    const endpoint = `https://accounts.spotify.com/authorize?client_id=${spotifyClientID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes}`

    return endpoint
  }

  public async getRefreshedInstance(_user: IUser) {
    const user = await userModel.findById(_user._id).exec()

    if (!user) {
      throw new Error('User not provided.')
    }

    const instance = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 30 * 1000,
      headers: {
        Authorization: `Bearer ${user.tokens.access_token}`
      }
    })

    createAuthRefreshInterceptor(instance, async (failedRequest: any) => {
      const refreshedTokens = await this.refreshToken(user.tokens)
      await userModel.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            tokens: refreshedTokens
          }
        }
      )
      failedRequest.response.config.headers.Authorization = `Bearer ${refreshedTokens.access_token}`
    })

    return instance
  }

  public getApiInstance(tokens: SpotifyTokens) {
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
      logger.error(
        `Spotify client error: ${JSON.stringify(error.response.data)}`,
        error
      )
      return null
    }
  }

  public async refreshToken(tokens: SpotifyTokens) {
    try {
      const params = new URLSearchParams()

      params.append('grant_type', 'refresh_token')
      params.append('refresh_token', tokens.refresh_token)
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
      console.error(error)
      return tokens
    }
  }

  public async getUserTracks(user: IUser) {
    try {
      const api = await this.getRefreshedInstance(user)
      const response = await api.get('/me/tracks?offset=0&limit=20')
      const data = response.data as SpotifyPagedResponse<SpotifyLikedTrack>

      while (data.next) {
        const nextResponse = await api.get(data.next)
        const nextData =
          nextResponse.data as SpotifyPagedResponse<SpotifyLikedTrack>
        data.items = data.items.concat(nextData.items)
        data.next = nextData.next
      }
      logger.info(`User has ${data?.items?.length} liked tracks!`)
      return data
    } catch (error) {
      logger.error(
        `Spotify client error: ${JSON.stringify(error.response.data)}`,
        error
      )
      return null
    }
  }

  public async createPlaylist(
    user: IUser,
    name: string,
    description: string,
    isPublic: boolean
  ) {
    try {
      const api = await this.getRefreshedInstance(user)
      const response = await api.post(
        `/users/${user.spotifyId}/playlists`,
        {
          name,
          description,
          public: isPublic
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data as { id: string }
    } catch (error) {
      logger.error('Failed to create playlist ', error)
      return null
    }
  }

  public async syncTracksToPlaylist(
    user: IUser,
    tracks: SpotifyLikedTrack[]
  ): Promise<string | null> {
    try {
      if (!user.playlist.id) {
        throw new Error('User does not have a playlist')
      }

      // First clear user playlist
      await this.clearPlaylist(user)

      // Then add tracks to playlist
      logger.info(`Adding ${tracks.length} tracks to playlist`)
      const api = await this.getRefreshedInstance(user)
      const batches = chunk(tracks, 100)
      let snapshot_id = ''

      await asyncForEach<SpotifyLikedTrack[]>(batches, async (batch, index) => {
        logger.info(
          `Processing batch #${index + 1} of ${batches.length} batches.`
        )
        // For each batch of 100 tracks
        const response: AxiosResponse<{ snapshot_id: string }> = await api.post(
          `/playlists/${user.playlist.id}/tracks`,
          {
            uris: batch.map((item) => item.track.uri)
            // .sort((a, b) =>
            //   isAfter(parseISO(a.added_at), parseISO(b.added_at)) ? -1 : 1
            // )
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.status !== 201) {
          throw new Error('Failed to add tracks to playlist')
        }

        snapshot_id = response.data.snapshot_id

        logger.info(`Completed, snapshot_id: ${snapshot_id}`)
      })

      return snapshot_id
    } catch (error) {
      logger.error('Spotify client error: ', error)
      console.error(error)
      return null
    }
  }

  public async getPlaylistTracks(user: IUser) {
    try {
      if (!user.playlist.id) {
        throw new Error('User does not have a playlist')
      }

      const api = await this.getRefreshedInstance(user)
      const response: AxiosResponse<
        SpotifyPagedResponse<SpotifyPlaylistTrack>
      > = await api.get(`/playlists/${user.playlist.id}/tracks`)
      const { data } = response

      while (data.next) {
        // TODO: we only get the uri here so the type doesn't really match
        const nextResponse: AxiosResponse<
          SpotifyPagedResponse<SpotifyPlaylistTrack>
        > = await api.get(data.next)
        const nextData = nextResponse.data
        data.items = data.items.concat(nextData.items)
        data.next = nextData.next
      }
      logger.info(`Playlist has ${data?.items?.length} tracks.`)
      return data
    } catch (error) {
      logger.error(
        `Spotify client error: ${JSON.stringify(error.response.data)}`,
        error
      )
      return null
    }
  }

  public async deletePlaylist(user: IUser) {
    const api = await this.getRefreshedInstance(user)
    await api.delete(`/playlists/${user.playlist.id}/followers`)
  }

  public async removePlaylistTracks(user: IUser, tracks: SpotifyTrack[]) {
    logger.info(`Removing ${tracks.length} tracks from playlist`)
    const api = await this.getRefreshedInstance(user)
    const batches = chunk(tracks, 100)
    let snapshot_id = ''

    await asyncForEach<SpotifyTrack[]>(batches, async (batch, index) => {
      logger.info(`Deleting batch #${index + 1} of ${batches.length} batches.`)
      // For each batch of 100 tracks
      const response = await api.delete(
        `/playlists/${user.playlist.id}/tracks`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            tracks: batch.map((track) => ({
              uri: track.uri
            }))
          }
        }
      )

      if (response.status !== 200) {
        throw new Error('Failed to delete from playlist')
      }

      snapshot_id = response.data.snapshot_id

      logger.info(`Completed, snapshot_id: ${snapshot_id}`)
    })
  }

  public async clearPlaylist(user: IUser) {
    logger.info('Clearing playlist..')
    const response = await this.getPlaylistTracks(user)
    const tracks = response?.items?.map((item) => item.track)

    if (tracks) {
      await this.removePlaylistTracks(user, tracks)
    }
  }
}

export default new SpotifyService()

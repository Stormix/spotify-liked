import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { AuthenticatedRequest } from '../interfaces/auth.interface'
import BaseController from './base.controller'
import spotifyService, { SpotifyService } from '../services/spotify.service'
import { UserService } from '../services/user.service'
import userModel from '../models/user.model'
import { syncQueue } from '../jobs/queues/sync-playlist.queue'

/**
 * User Controller
 */

class UsersController extends BaseController {
  /**
   * Get Authenticated User
   */
  async getAuthenticatedUser(req: AuthenticatedRequest, res: Response) {
    // Await the exec function since it's async in for UserResources
    return this.ok(res, req.user)
  }

  async getUrl(req: Request, res: Response) {
    try {
      const origin = req.headers.origin || 'localhost'

      return this.ok(res, {
        redirect_url: SpotifyService.login(origin)
      })
    } catch (error) {
      return this.fail(res, error)
    }
  }

  async authenticateUser(req: Request, res: Response) {
    try {
      const origin = req.headers.origin || 'localhost'
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return this.invalid(res)
      }
      const { code } = req.body
      const tokens = await spotifyService.getUserTokens(origin, code)

      if (!tokens) {
        return this.fail(res, new Error('Invalid code'))
      }

      const spotifyUser = await spotifyService.getUserInfo(tokens)

      if (!spotifyUser) {
        return this.fail(res, new Error('Invalid tokens'))
      }

      const user = await UserService.findOrCreate(spotifyUser, tokens)

      return await this.jwtToken(res, user)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  async getUserTracks(req: AuthenticatedRequest, res: Response) {
    try {
      const { user } = req
      const tracks = await spotifyService.getUserTracks(user)
      if (!tracks?.items) {
        return this.clientError(res, 'No tracks found')
      }
      return this.ok(res, tracks?.items ?? [])
    } catch (error) {
      return this.fail(res, error)
    }
  }

  async createPlaylist(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return this.invalid(res)
      }

      const { user } = req
      const { name, description, isPublic, sync } = req.body

      // Ensure the user doesn't already have a playlist with the same name
      if (user.playlist) {
        return this.clientError(res, 'User already has a playlist')
      }

      const response = await spotifyService.createPlaylist(
        user,
        name,
        description,
        isPublic
      )

      if (!response) {
        return this.fail(res, new Error('Could not create playlist'))
      }

      // Update user playlist
      await userModel
        .updateOne({
          playlist: {
            id: response.id,
            name,
            description,
            isPublic,
            sync,
            lastUpdated: new Date(),
            status: 'created'
          }
        })
        .exec()

      return this.created(res)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  async deletePlaylist(req: AuthenticatedRequest, res: Response) {
    try {
      const { user } = req

      // Ensure the user doesn't already have a playlist with the same name
      if (!user.playlist) {
        return this.clientError(res, "User doesn't have a playlist")
      }

      await spotifyService.deletePlaylist(user)

      // Update user playlist
      await userModel
        .updateOne({
          playlist: null
        })
        .exec()

      return this.ok(res)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  async syncPlaylist(req: AuthenticatedRequest, res: Response) {
    try {
      const { user } = req

      // Ensure the user doesn't already have a playlist with the same name
      if (!user.playlist) {
        return this.clientError(res, "User doesn't have a playlist")
      }

      await syncQueue.add({ user_id: user.id })

      await userModel
        .updateOne({
          playlist: {
            ...user.playlist,
            status: 'queued'
          }
        })
        .exec()

      return this.ok(res)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}

export default UsersController

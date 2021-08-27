import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { AuthenticatedRequest } from '../interfaces/auth.interface'
import BaseController from './base.controller'
import spotifyService, { SpotifyService } from '../services/Spotify.service'
import { UserService } from '../services/user.service'

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
      const tracks = await spotifyService.getUserTracks(user.tokens)

      return this.ok(res, tracks.items)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}

export default UsersController

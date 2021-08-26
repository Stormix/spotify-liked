import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { accessTokenLife } from '../env'
import { AuthenticatedRequest } from '../interfaces/auth.interface'
import BaseController from './base.controller'
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


  /**
   * Register new user
   */
  async registerUser(req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return this.invalid(res)
    }

    try {
      const newUser = await UserService.register(req.body, req)
      const accessToken = UserService.generateToken(newUser)

      return this.created(res, {
        token: accessToken,
        expiresIn: accessTokenLife
      })
    } catch (error) {
      return this.fail(res, error)
    }
  }

  /**
   * Login new user
   *
   */
  async loginUser(req: Request, res: Response) {
    try {
      const origin = req.headers.origin || 'localhost'
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return this.invalid(res)
      }

      const user = await UserService.login(
        req.body.email.toLowerCase(),
        req.body.password
      )

      const accessToken = UserService.generateToken(user)
      return this.ok(res, {
        token: accessToken,
        expiresIn: accessTokenLife
      })
    } catch (error) {
      return this.fail(res, error)
    }
  }

}

export default UsersController

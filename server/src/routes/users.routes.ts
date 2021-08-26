import { Request, Response, Router } from 'express'
import { check } from 'express-validator'
import UsersController from '../controllers/users.controller'
import { AuthenticatedRequest } from '../interfaces/auth.interface'
import Route from '../interfaces/routes.interface'

import authMiddleware from '../middleware/auth.middleware'

class UsersRoute implements Route {
  public path = 'users'

  public router = Router()

  public usersController = new UsersController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get('/me', authMiddleware(), (req: AuthenticatedRequest, res: Response) =>
      this.usersController.getAuthenticatedUser(req, res)
    )

    this.router.post(
      '/login',
      [
        check('email').isEmail().normalizeEmail(),
        check('password').not().isEmpty()
      ],
      (req: Request, res: Response) => this.usersController.loginUser(req, res)
    )

    this.router.post(
      '/register',
      [
        check('email').isEmail().normalizeEmail(),
        check('password').not().isEmpty()
      ],
      (req: Request, res: Response) =>
        this.usersController.registerUser(req, res)
    )

  }
}

export default UsersRoute

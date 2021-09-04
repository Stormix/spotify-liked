import { Request, Response, Router } from 'express'
import { check } from 'express-validator'
import UsersController from '../controllers/users.controller'
import { AuthenticatedRequest } from '../interfaces/auth.interface'
import Route from '../interfaces/routes.interface'
import authMiddleware from '../middleware/auth.middleware'
import cacheMiddleware from '../middleware/cache.middleware'

class UsersRoute implements Route {
  public path = 'users'

  public router = Router()

  public usersController = new UsersController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '/me',
      authMiddleware(),
      (req: AuthenticatedRequest, res: Response) =>
        this.usersController.getAuthenticatedUser(req, res)
    )

    this.router.post('/spotify', (req: Request, res: Response) =>
      this.usersController.getUrl(req, res)
    )

    this.router.post(
      '/auth',
      [check('code').not().isEmpty()],
      (req: Request, res: Response) =>
        this.usersController.authenticateUser(req, res)
    )

    this.router.get(
      '/tracks',
      [authMiddleware(), ...cacheMiddleware('tracks')],
      (req: AuthenticatedRequest, res: Response) =>
        this.usersController.getUserTracks(req, res)
    )

    this.router.post(
      '/playlist',
      [
        authMiddleware(),
        check('name').not().isEmpty(),
        check('description').not().isEmpty(),
        check('isPublic').not().isEmpty(),
        check('sync').not().isEmpty()
      ],
      (req: AuthenticatedRequest, res: Response) =>
        this.usersController.createPlaylist(req, res)
    )

    this.router.delete(
      '/playlist',
      [authMiddleware()],
      (req: AuthenticatedRequest, res: Response) =>
        this.usersController.deletePlaylist(req, res)
    )

    this.router.post(
      '/playlist/sync',
      [authMiddleware()],
      (req: AuthenticatedRequest, res: Response) =>
        this.usersController.syncPlaylist(req, res)
    )
  }
}

export default UsersRoute

import jwt from 'jsonwebtoken'
import { IUser } from '../interfaces/user.interface'
import logger from '../utils/logger'
import { accessTokenLife, accessTokenSecret } from '../env'
import { SpotifyTokens, SpotifyUser } from './Spotify.service'
import userModel from '../models/user.model'

export interface UserCreateObject {
  email: string
  password?: string
}
export class UserService {
  private user: IUser

  constructor(user?: IUser) {
    this.user = user
  }

  static async findOrCreate(user: SpotifyUser, tokens: SpotifyTokens) {
    if (!tokens || !user) {
      throw new Error('No tokens or user provided')
    }
    const dbUser = await userModel.findOne({ email: user.email }).exec()

    if (dbUser) {
      return dbUser
    }

    return userModel.create({
      email: user.email,
      spotifyId: user.id,
      displayName: user.display_name,
      tokens,
      imageUrl: user.images?.[0]?.url ?? null
    })
  }

  /**
   * Fetch a user by a field value
   * @param {string} field
   * @param {string} value
   */
  static async getUserBy(field: string, value: string): Promise<IUser> {
    if (!field) {
      return null
    }
    try {
      const filter: any = {}
      filter[field] = value
      return await userModel
        .findOne(filter)
        .populate([
          // TODO
        ])
        .exec()
    } catch (e) {
      logger.error('Error in UserService/GetUserBy', e)
      return null
    }
  }

  static generateToken(user: IUser) {
    const body = { _id: user._id, email: user.email }
    const accessToken = jwt.sign({ user: body }, accessTokenSecret, {
      algorithm: 'HS256',
      expiresIn: accessTokenLife
    })
    // TODO: make use of the refresh token
    // const refreshToken = jwt.sign({ user: body }, refreshTokenSecret, {
    //   algorithm: 'HS256',
    //   expiresIn: refreshTokenLife
    // })
    // return {
    // accessToken
    // refreshToken
    // }
    return accessToken
  }
}

import { IUser } from "../interfaces/user.interface"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'
import User from '../models/user.model'
import { accessTokenLife, accessTokenSecret } from '../env'

export interface UserCreateObject {
  email: string
  password?: string
}
export class UserService {
  private user: IUser

  constructor(user?: IUser) {
    this.user = user
  }
  /**
   *
   * Register new user using device ID or email - this assumes all input data was already validated
   * and atleast one of the two is set (email or deviceID)
   *
   * @param user UserCreateObject
   *
   * @returns
   */

  static async createUser(user: UserCreateObject) {
    const emailVerificationToken = crypto.randomBytes(64).toString('hex')

    const payload: any = {
      email: user.email,
      password: bcrypt.hashSync(user.password),

    }

    // Check if the user already exists. Do this after the extra Gmail verification step
    const oldUser = await UserService.getUserBy('email', payload.email)

    if (oldUser?._id) {
      throw new Error('A user with this email already exists.')
    }

    return new User(payload).save()
  }

  /**
   * Register new user - this assumes all input data was already validated
   * @param {User} user
   */
  static async register(user: UserCreateObject, req: Request = null) {
    const ip =
      (req?.headers?.['x-forwarded-for'] as string) ||
      null

    const newUser = await UserService.createUser({ ...user })


    return newUser
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
      return await User.findOne(filter)
        .populate([

          // TODO
        ])
        .exec()
    } catch (e) {
      logger.error('Error in UserService/GetUserBy', e)
      return null
    }
  }

  /**
   * Login user - returns the user doc
   * @param {string} email
   * @param {string} password
   */
  static async login(email: any, password: any) {
    const user = await UserService.getUserBy('email', email)
    if (!user) {
      throw new Error('User not found')
    }
    if (
      !bcrypt.compareSync(password, user.password) // Check user password
    ) {
      throw new Error('Incorrect password')
    }

    return user
  }

  static generateToken(user: any) {
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
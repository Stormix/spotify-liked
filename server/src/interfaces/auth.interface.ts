import { Request } from 'express'
import { IUser } from './user.interface'

export interface DataStoredInToken {
  user: {
    _id: string
    email: string
  }
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface AuthenticatedRequest extends Request {
  user?: IUser
  file?: any
}

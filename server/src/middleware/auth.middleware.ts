import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import User from '../models/user.model'
import { accessTokenSecret } from '../env'
import {
  AuthenticatedRequest,
  DataStoredInToken
} from '../interfaces/auth.interface'
import { UserService } from '../services/user.service'
import HttpException from '../exceptions/HttpException'

/**
 * Auth middleware
 *
 * @param {boolean} isAdmin whether this route requires admin priviliges
 * @param {boolean} optional whether being authenticated is optional on this route
 */

const authMiddleware = (isAdmin = false, optional = false) => async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers?.authorization?.replace('Bearer ', '')

    if (!optional && (!accessToken || accessToken === 'null')) {
      return next(new HttpException(401, 'Unauthorized (A1)'))
    }

    const decoded = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as DataStoredInToken

    if (!decoded?.user?._id && !optional) {
      return next(new HttpException(400, 'Unauthorized (A4)'))
    }

    const user = decoded?.user?._id
      ? await UserService.getUserBy('_id', decoded.user._id)
      : null


    if (user) {
      // update user set lastActive
      await User.updateOne(
        { _id: user._id },
        {
          $set: { lastActive: new Date() }
        }
      ).exec()
      delete user.password // remove the password field
    }

    req.user = user

    return next()
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (optional) {
        return next()
      }
      return next(new HttpException(401, 'Unauthorized (A1)'))
    }
    return next(new HttpException(500, 'Somthing went wrong.'))
  }
}

export default authMiddleware

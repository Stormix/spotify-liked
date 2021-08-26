import { NextFunction, Request, Response } from 'express'
import { env } from '../env'
import HttpException from '../exceptions/HttpException'
import logger from '../utils/logger'

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500
    const message = `Something went wrong, error code: ${
      (res as any)?.sentry ?? 'NOT_PROVIDED'
    }`

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    )

    if (env.isDev) {
      console.error('Error details: ', error)
    }

    res.status(status).json({ message })
  } catch (err) {
    next(err)
  }
}

export default errorMiddleware

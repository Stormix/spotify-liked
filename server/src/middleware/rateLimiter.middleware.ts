import { RateLimiterMongo } from 'rate-limiter-flexible'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { mongoUri, env } from '../env'
import mongooseConfig from '../config/mongoose.config'

const mongoConn = env.isTest
  ? mongoose.connection
  : mongoose.createConnection(mongoUri, mongooseConfig)

const rateLimiter = new RateLimiterMongo({
  storeClient: mongoConn,
  keyPrefix: 'rate_limiter',
  points: 25, // 10 requests
  duration: 1 // per 1 second by IP
})

const rateLimiterMiddleware = (req: Request, res: Response, next: any) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next()
    })
    .catch(() => {
      return res.status(429).send('Too Many Requests')
    })
}

export default rateLimiterMiddleware

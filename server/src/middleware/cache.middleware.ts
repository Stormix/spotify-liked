import ExpressRedisCache from 'express-redis-cache'
import { NextFunction, Response } from 'express'
import { cacheDuration } from '../config/cache.config'
import redisProvider from '../providers/redis.provider'
import { AuthenticatedRequest } from '../interfaces/auth.interface'

export const cache = ExpressRedisCache({
  client: redisProvider.redis,
  prefix: 'spotify-liked:',
  expire: cacheDuration
})

export default (name?: string) => {
  return [
    (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      res.express_redis_cache_name = `user:${req.user.id}:${name} `
      next()
    },
    cache.route({
      expire: {
        200: cacheDuration,
        '4xx': 10,
        '5xx': 10,
        xxx: 1
      }
    })
  ]
}

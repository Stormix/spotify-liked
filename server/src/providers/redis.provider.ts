/* eslint-disable no-console */
import redis, { RedisClient } from 'redis'
import { promisify } from 'util'
import { redisConfig } from '../env'
import logger from '../utils/logger'

export interface RedisConfig {
  port: number
  host: string
  password?: string
}

export class Redis {
  redis: RedisClient

  constructor(config: RedisConfig) {
    this.redis = redis.createClient(config.port, config.host, {
      password: config?.password ?? null
    })
    this.redis.on('error', (err) => {
      console.error(err)
      logger.error('REDIS: ', err)
    })
  }

  public async set(key: string, value: any, expire?: number) {
    const setAsync = promisify(this.redis.set).bind(this.redis)
    if (expire) {
      return setAsync(key, value, 'EX', expire)
    }
    return setAsync(key, value)
  }

  public async get(key: string) {
    const getAsync = promisify(this.redis.get).bind(this.redis)
    return getAsync(key)
  }

  public async del(key: string) {
    const delAsync = promisify(this.redis.del).bind(this.redis)
    return delAsync(key)
  }

  public async flush() {
    const flushAllAsync = promisify(this.redis.flushall).bind(this.redis)
    return flushAllAsync.flushall()
  }
}

export default new Redis({
  port: Number(redisConfig.port),
  host: redisConfig.host,
  password: redisConfig.password
})

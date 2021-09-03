import Queue from 'bull'
import { redisConfig } from '../../env'

export const syncAllUsersQueue = new Queue('sync-all-users', {
  redis: {
    host: redisConfig.host,
    port: Number(redisConfig.port),
    password: redisConfig.password
  }
})

import Queue from 'bull'
import { redisConfig } from '../../env'

export const syncQueue = new Queue<SyncQueueJobPayload>('sync-playlist', {
  redis: {
    host: redisConfig.host,
    port: Number(redisConfig.port),
    password: redisConfig.password
  }
})

export interface SyncQueueJobPayload {
  user_id: string
}

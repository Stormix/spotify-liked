import { syncAllUsersQueue } from './queues/sync-users.queue'
import { syncQueue } from './queues/sync-playlist.queue'
import { syncPlaylist } from './processes/sync-playlist.process'
import { syncUsers } from './processes/sync-users.process'
import App from '../app'
import { env } from '../env'

const app = new App(env, [])

syncQueue.process(async (job, done) => {
  syncPlaylist(job, done)
})

syncAllUsersQueue.process(async (job, done) => {
  syncUsers(job, done)
})

// Repeat job once every day at midnight
syncAllUsersQueue.add(null, {
  cron: '0 0 * * *'
})

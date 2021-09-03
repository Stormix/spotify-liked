import { Job, DoneCallback } from 'bull'
import { IUser } from '../../interfaces/user.interface'
import userModel from '../../models/user.model'
import { asyncForEach } from '../../utils/array.utils'
import logger from '../../utils/logger'
import { syncQueue } from '../queues/sync-playlist.queue'

export const syncUsers = async (job: Job, done: DoneCallback) => {
  try {
    // Get all users that have sync on
    const users = await userModel.find({ 'playlist.sync': true }).exec()

    // Sync each user
    await asyncForEach<IUser>(users, async (user) => {
      await syncQueue.add({ user_id: user._id }, { attempts: 3 })
    })

    done()
  } catch (error) {
    logger.error(`Error queueing sync jobs for all users`, error)
    done(error)
  }
}

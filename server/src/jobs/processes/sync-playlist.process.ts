import { DoneCallback, Job } from 'bull'
import userModel from '../../models/user.model'
import spotifyService from '../../services/spotify.service'
import logger from '../../utils/logger'
import { SyncQueueJobPayload } from '../queues/sync-playlist.queue'

export const syncPlaylist = async (
  job: Job<SyncQueueJobPayload>,
  done: DoneCallback
) => {
  const { user_id } = job.data

  logger.info(`Syncing playlist for user ${user_id}`)

  const user = await userModel.findById(user_id).exec()
  try {
    if (!user.playlist) {
      logger.info(`User ${user_id} has no playlist. Skipping..`)
      // Skip this job
      return done()
    }

    // Update user's playlist status
    user.playlist = {
      ...user.playlist,
      status: 'syncing'
    }
    await user.save()

    logger.info(`Fetching user liked tracks!`)

    const spotifyResponse = await spotifyService.getUserTracks(user)
    const tracks = spotifyResponse.items

    // Add tracks to user playlist
    const snapshot_id = await spotifyService.syncTracksToPlaylist(user, tracks)

    if (!snapshot_id) {
      throw new Error('Failed to sync playlist, snapshot ID not found')
    }

    // Update user's playlist info
    user.playlist = {
      ...user.playlist,
      lastUpdated: new Date(),
      snapshot_id,
      length: tracks.length,
      status: 'synced'
    }
    await user.save()

    return done()
  } catch (err) {
    logger.error(`Error syncing playlist for user ${user_id}`, err)

    user.playlist = {
      ...user.playlist,
      status: 'error'
    }
    await user.save()

    return done(err)
  }
}

export interface Playlist {
  id: string
  name: string
  description?: string
  sync: boolean
  isPublic: boolean
  lastUpdated?: Date
  snapshot_id?: string
  length?: number
  status?: 'created' | 'queued' | 'syncing' | 'synced' | 'error' | 'outdated'
}

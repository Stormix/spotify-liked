export interface Playlist {
  id: string
  name: string
  description?: string
  sync: boolean
  isPublic: boolean
  lastUpdated?: string
  snapshot_id?: string
  length?: number
  status?: 'queued' | 'syncing' | 'synced' | 'error' | 'outdated'
}

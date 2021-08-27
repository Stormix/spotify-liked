export interface SpotifyPagedResponse<T> {
  href: string
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

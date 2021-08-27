import { SpotifyImage } from './SpotifyImage'

export interface SpotifyUser {
  display_name: string
  external_urls: {
    spotify: string
  }
  email: string
  href: string
  id: string
  type: string
  uri: string
  images: SpotifyImage[]
  product: string
}

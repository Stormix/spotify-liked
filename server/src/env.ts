import dotenv from 'dotenv'
import ms from 'ms'
import { generateTestENV } from './utils/testEnv'
import validateEnv from './utils/validateEnv'

dotenv.config()

export const env =
  process.env.NODE_ENV !== 'test' ? validateEnv() : generateTestENV()

export const port = env.PORT
export const baseUrl = env.API_BASE_URL
export const mongoUri = env.MONGO_URI
export const dsn = env.DSN

export const templates = {}

export const accessTokenSecret = env.ACCESS_TOKEN_SECRET
// TODO: decrease the access token life and make use of the refresh token
export const accessTokenLife = ms('15 days')
export const refreshTokenSecret = env.REFRESH_TOKEN_SECRET
export const refreshTokenLife = 86400
export const sessionCookieName = 'spotify-liked-session'
export const spotifyClientID = env.SPOTIFY_CLIENT_ID
export const spotifyClientSecret = env.SPOTIFY_CLIENT_SECRET

export const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD
}

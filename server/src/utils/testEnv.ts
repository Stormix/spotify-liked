import { cleanEnv } from 'envalid'
import { validators } from './validateEnv'

export const env = {
  NODE_ENV: 'test',
  PORT: 3000,
  API_BASE_URL: '',
  MONGO_URI: '',
  DSN: '',
  ACCESS_TOKEN_SECRET: '',
  REFRESH_TOKEN_SECRET: '',
  ALLOWED_ORIGINS: '',
  SPOTIFY_CLIENT_ID: '',
  SPOTIFY_CLIENT_SECRET: '',
  REDIS_HOST: '',
  REDIS_PORT: '',
  REDIS_PASSWORD: ''
}

export const generateTestENV = () => {
  return cleanEnv(env, validators)
}

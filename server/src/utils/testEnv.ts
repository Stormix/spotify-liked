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
  ALLOWED_ORIGINS: ''
}

export const generateTestENV = () => {
  return cleanEnv(env, validators)
}

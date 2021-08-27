import { cleanEnv, port, str } from 'envalid'

export const validators = {
  NODE_ENV: str(),
  PORT: port(),
  API_BASE_URL: str(),
  MONGO_URI: str(),
  DSN: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  ALLOWED_ORIGINS: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str()
}
const validateEnv = () => {
  return cleanEnv(process.env, validators)
}

export default validateEnv

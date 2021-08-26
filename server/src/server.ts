import 'dotenv/config'
import UserRoutes from './routes/users.routes'

import App from './app'
import { env } from './env'

const app = new App(env, [
  new UserRoutes(),
])

app.listen()

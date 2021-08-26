import { Router } from 'express'

interface Route {
  path?: string | string[]
  router: Router
}

export default Route

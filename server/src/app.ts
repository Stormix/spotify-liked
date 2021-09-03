// import expressListRoutes from 'express-list-routes'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { createServer, Server as HttpServer } from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import mongooseConfig from './config/mongoose.config'
import { dsn, mongoUri, port } from './env'
import Route from './interfaces/routes.interface'
import { syncQueue } from './jobs/queues/sync-playlist.queue'
import { syncAllUsersQueue } from './jobs/queues/sync-users.queue'
import errorMiddleware from './middleware/error.middleware'
import rateLimiterMiddleware from './middleware/rateLimiter.middleware'
import { Environment } from './typings/Environment'
import logger, { stream } from './utils/logger'

class App {
  public app: Application

  public port: string | number

  public env: Environment

  public server: HttpServer

  public allowedOrigins: string[]

  constructor(env: Environment, routes: Route[]) {
    this.app = express()
    this.port = port || 3000
    this.env = env
    this.server = createServer(this.app)

    // CORS config
    this.allowedOrigins = ['localhost']

    if (!this.env.isTest) {
      process.env.ALLOWED_ORIGINS?.split(',').forEach((url) => {
        this.allowedOrigins.push(new URL(url)?.hostname)
        this.allowedOrigins.push(`www.${new URL(url)?.hostname}`)
      })
      this.initializeDB()
    }

    if (this.env.isProduction) {
      this.initializeSentry()
    }

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeBullBoard()
    this.initializeErrorHandling()
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`)
      logger.info(`======= ENV: ${this.env.NODE_ENV}  =======`)
      logger.info(`🚀 API listening on the port ${this.port}`)
      logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    if (this.env.isProduction) {
      this.app.use(rateLimiterMiddleware)
    } else {
      this.app.use(morgan('dev', { stream }))
    }

    this.initializeCors()
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(
      express.json({
        limit: '50mb',
        verify: (req: any, res: Response, buf: any) => {
          req.rawBody = buf
        }
      })
    )
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cookieParser())
  }

  private initializeRoutes(routes: Route[]) {
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        name: 'Spotify Liked API',
        version: 'v1'
      })
    })
    routes.forEach((route) => {
      if (Array.isArray(route.path)) {
        ;(route.path as string[]).forEach((alias) => {
          this.app.use(`/v1/${alias}`, route.router)
        })
      } else {
        this.app.use(`/v1/${route.path}`, route.router)
      }
    })

    logger.info('Loaded all routes..')
    // expressListRoutes(this.app)
  }

  private initializeErrorHandling() {
    // Express missing routes handling
    this.app.use((req: Request, res: Response) => {
      return res.status(404).end('404')
    })

    this.app.use(Sentry.Handlers.errorHandler())
    this.app.use(errorMiddleware)
  }

  private initializeDB() {
    mongoose.Promise = global.Promise
    mongoose.connect(mongoUri, mongooseConfig)
  }

  private initializeSentry() {
    if (this.env.isTest) {
      return
    }
    // Sentry error handling config
    Sentry.init({
      dsn,
      release: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
          app: this.app
        })
      ],
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0
    })
    this.app.use(Sentry.Handlers.requestHandler())
    // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler())
  }

  private initializeCors() {
    if (this.env.isTest) {
      return
    }

    this.app.use(
      cors({
        origin: (origin: any, callback: any) => {
          if (!origin) return callback(null, true)
          if (!this.allowedOrigins.includes(new URL(origin)?.hostname)) {
            logger.info(`CORS: An unknown client made a request from ${origin}`)
            return callback(null, false)
          }
          return callback(null, true)
        }
      })
    )
  }

  private initializeBullBoard() {
    if (this.env.isTest) {
      return
    }
    const serverAdapter = new ExpressAdapter()
    createBullBoard({
      queues: [new BullAdapter(syncAllUsersQueue), new BullAdapter(syncQueue)],
      serverAdapter
    })

    serverAdapter.setBasePath('/jobs')
    this.app.use('/jobs', serverAdapter.getRouter())
  }
}

export default App

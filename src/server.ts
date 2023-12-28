import 'reflect-metadata'
import fastify from 'fastify'
import fastifyExpress from '@fastify/express'
import passport from 'passport'
import { HealthCheckController } from './application/health-check/controllers/health-check.controller'
import { setupPassport } from './infrastructure/auth/local.auth'
import * as dotenv from 'dotenv'
import { logger } from './shared/loggers/logger'
import dataSource from './config/datasource.config'
import { BTCController } from './application/btc/controllers/btc.controller'
import { initializeControllers } from './shared/utils/controller-init'
import { UserController } from './application/user/controllers/user.controller'
import { AccountController } from './application/account/controllers/account.controller'

dotenv.config()

const server = fastify()

const startServer = async () => {
  await server.register(fastifyExpress)

  server.use(passport.initialize())
  setupPassport(passport)
  logger.info('Passport initialized')

  await dataSource.initialize()
  logger.info('Database connected')

  const controllers = [
    HealthCheckController,
    BTCController,
    UserController,
    AccountController,
  ]

  initializeControllers(server, controllers)

  try {
    await server.listen(3000)
    logger.info('Server listening on port 3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

startServer()

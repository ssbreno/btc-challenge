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
import cron from 'node-cron'
import { DeleteHistoryUseCase } from './application/history/use-cases/delete-history.use-case'
import { BTCMarketUseCase } from './application/btc/use-cases/find-btc.use-case'
import { CreateHistoryUseCase } from './application/history/use-cases/create-history.use-case'
import { HistoryController } from './application/history/controllers/history.controller'

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
    HistoryController,
  ]

  initializeControllers(server, controllers)

  const runDeleteHistoryJob = async () => {
    const deleteHistoryUseCase = new DeleteHistoryUseCase()
    try {
      await deleteHistoryUseCase.deleteHistory()
      logger.info('History successfully deleted')
    } catch (error) {
      console.error('Error running delete history job:', error)
    }
  }

  const fetchBitcoinPricesJob = async () => {
    const bTCMarketUseCase = new BTCMarketUseCase()
    const createHistoryUseCase = new CreateHistoryUseCase()
    try {
      const btcPrice = await bTCMarketUseCase.execute()
      logger.warn('Checking BTC Price')
      const createHistoryDTO = {
        buyPrice: btcPrice.ticker.buy,
        sellPrice: btcPrice.ticker.sell,
      }
      logger.warn('Create History')
      await createHistoryUseCase.createHistory(createHistoryDTO)
    } catch (error) {
      console.error('Error fetching Bitcoin prices:', error)
    }
  }

  try {
    await server.listen(3000)
    logger.info('Server listening on port 3000')
    cron.schedule('0 0 * * *', runDeleteHistoryJob)
    cron.schedule('*/10 * * * *', fetchBitcoinPricesJob)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

startServer()

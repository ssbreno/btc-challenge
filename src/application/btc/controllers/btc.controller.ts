import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '../../../shared/loggers/logger'
import { BTCMarketUseCase } from '../use-cases/find-btc.use-case'

export class BTCController {
  public unprotectedRoutes = ['/btc-market/ticker']
  private bTCMarketUseCase: BTCMarketUseCase

  constructor(private server: FastifyInstance) {
    this.bTCMarketUseCase = new BTCMarketUseCase()
    logger.warn('[GET] /btc-market/ticker')
    this.server.get('/btc-market/ticker', this.checkBTCMarket.bind(this))
  }

  private async checkBTCMarket(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const tickerObservable = this.bTCMarketUseCase.fetchBitcoinTicker()
      tickerObservable.subscribe({
        next: (data) => reply.send(data),
        error: (err) => reply.status(500).send(err.message),
      })
    } catch (error) {
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

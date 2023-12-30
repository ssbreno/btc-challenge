import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '../../../shared/loggers/logger'
import { BTCMarketUseCase } from '../use-cases/find-btc.use-case'
import { BuyBTCUseCase } from '../use-cases/buy-btc.use-case'
import { authUtils } from '../../../shared/utils/extract-token'
import { PositionBTCUseCase } from '../use-cases/position-btc.use-case'
import { VolumeBTCUseCase } from '../use-cases/volume-btc.use-case'
import { SellBTCUseCase } from '../use-cases/sell-btc.use-case'

export class BTCController {
  private bTCMarketUseCase = new BTCMarketUseCase()
  private buyBTCUseCase = new BuyBTCUseCase()
  private positionBTCUseCase = new PositionBTCUseCase()
  private volumeBTCUseCase = new VolumeBTCUseCase()
  private sellBTCUseCase = new SellBTCUseCase()

  constructor(private server: FastifyInstance) {
    logger.warn('[GET] /btc/price')
    this.server.get('/btc/price', this.checkBTCMarket.bind(this))
    logger.warn('[POST] /btc/purchase')
    this.server.post('/btc/purchase', this.buyBTC.bind(this))
    logger.warn('[GET] /btc')
    this.server.get('/btc', this.positionBTC.bind(this))
    logger.warn('[GET] /volume')
    this.server.get('/volume', this.volumeBTC.bind(this))
    logger.warn('[POST] /btc/sell')
    this.server.post('/btc/sell', this.sellBTC.bind(this))
  }

  async checkBTCMarket(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const tickerObservable = await this.bTCMarketUseCase.execute()
      reply.send(tickerObservable)
    } catch (error) {
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }

  async buyBTC(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const token = authUtils.extractToken(request, reply)
      if (!token) return
      const body = request.body
      const buyBTC = await this.buyBTCUseCase.execute(token, body)
      reply.send(buyBTC)
    } catch (error) {
      console.log(error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }

  async sellBTC(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const token = authUtils.extractToken(request, reply)
      if (!token) return
      const body = request.body
      const sellBTC = await this.sellBTCUseCase.execute(token, body)
      reply.send(sellBTC)
    } catch (error) {
      console.log(error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }

  async positionBTC(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const token = authUtils.extractToken(request, reply)
      if (!token) return
      const buyBTC = await this.positionBTCUseCase.execute(token)
      reply.send(buyBTC)
    } catch (error) {
      console.log(error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }

  async volumeBTC(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const volumeBTC = await this.volumeBTCUseCase.execute()
      reply.send(volumeBTC)
    } catch (error) {
      console.log(error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

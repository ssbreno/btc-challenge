import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '../../../shared/loggers/logger'
import { BTCMarketUseCase } from '../use-cases/find-btc.use-case'
import { BuyBTCUseCase } from '../use-cases/buy-btc.use-case';
import { extractToken } from '../../../shared/utils/extract-token';

export class BTCController {
  private bTCMarketUseCase = new BTCMarketUseCase();
  private buyBTCUseCase = new BuyBTCUseCase();

  constructor(private server: FastifyInstance) {
    this.bTCMarketUseCase = new BTCMarketUseCase()
    logger.warn('[GET] /btc/price')
    this.server.get('/btc/price', this.checkBTCMarket.bind(this))
    logger.warn('[POST] /btc/purchase')
    this.server.post('/btc/purchase', this.buyBTC.bind(this))
  }

   async checkBTCMarket(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const tickerObservable = await this.bTCMarketUseCase.execute();
      reply.send(tickerObservable)
    } catch (error) {
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }

   async buyBTC(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const token = extractToken(request, reply)
      if (!token) return
      const body = request.body;
      const buyBTC = await this.buyBTCUseCase.execute(token, body);
      reply.send(buyBTC)
    } catch (error) {
      console.log(error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

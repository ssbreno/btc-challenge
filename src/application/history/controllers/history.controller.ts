import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { FindHistoryUseCase } from '../use-cases/find-history.use-case'
import { logger } from '../../../shared/loggers/logger'

export class HistoryController {
  private findHistoryUseCase = new FindHistoryUseCase()

  constructor(private server: FastifyInstance) {
    logger.warn('[GET] /history')
    this.server.get('/history', this.getHistory.bind(this))
  }

  async getHistory(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const tickerObservable = await this.findHistoryUseCase.execute()
      reply.send(tickerObservable)
    } catch (error) {
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

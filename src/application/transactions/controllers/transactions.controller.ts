import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { FindAllTransactionsUseCase } from '../use-cases/find-all-transactions.use-case'
import { logger } from '../../../shared/loggers/logger'
import { FindAllTransactionsDTO } from '../../../domain/dtos/transactions/find-all-transactions.dto'
import { extractToken } from '../../../shared/utils/extract-token'

export class TransactionsController {
  private findAllTransactionsUseCase = new FindAllTransactionsUseCase()

  constructor(private server: FastifyInstance) {
    logger.warn('[GET] /extract')
    this.server.get('/extract', this.getHistory.bind(this))
  }

  async getHistory(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const dto = request.query as FindAllTransactionsDTO
      const token = extractToken(request, reply)
      if (!token) return
      const transactions =
        await this.findAllTransactionsUseCase.findAllTransactions(dto, token)
      reply.send(transactions)
    } catch (error) {
      logger.error('Error getting transactions:', error)
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

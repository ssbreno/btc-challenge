import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { logger } from "../../../shared/loggers/logger"

export class TransactionsController {

  constructor(private server: FastifyInstance) {
    logger.warn('[GET] /extract')
    this.server.get('/extract', this.getHistory.bind(this))
  }

  async getHistory(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {

    } catch (error) {
      reply.status(500).send(`Server error: ${error.message}`)
    }
  }
}

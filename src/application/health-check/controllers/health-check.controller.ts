import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HealthCheck } from '../use-cases/health-check.use-case'
import { logger } from '../../../shared/loggers/logger'
export class HealthCheckController {
  public unprotectedRoutes = ['/health-check']
  private healthCheck: HealthCheck

  constructor(private server: FastifyInstance) {
    this.healthCheck = new HealthCheck()
    logger.warn('[GET] /health-check')
    this.server.get('/health-check', this.checkHealth.bind(this))
  }

  private async checkHealth(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    logger.info('Health check initiated')
    const healthStatus = await this.healthCheck.check()
    logger.info('Health check completed', healthStatus)
    reply.send(healthStatus)
  }
}

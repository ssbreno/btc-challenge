import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '../../../shared/loggers/logger'
import { AuthDTO } from '../../../domain/dtos/auth/auth.dto'
import { LoginUseCase } from '../use-cases/login.use-case'

export class UserController {
  public unprotectedRoutes = ['/login']
  private loginUseCase = new LoginUseCase()

  constructor(private server: FastifyInstance) {
    this.loginUseCase = new LoginUseCase()
    logger.warn('[POST] /login')
    this.server.post('/login', this.login.bind(this))
  }
  async login(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const body: AuthDTO = request.body
    const account = await this.loginUseCase.login(body)
    reply.send(account)
  }


}

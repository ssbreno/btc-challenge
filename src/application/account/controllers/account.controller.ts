import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { CreateUserDTO } from '../../../domain/dtos/user/create-user.dto'
import { logger } from '../../../shared/loggers/logger'
import { CreateUserUseCase } from '../../user/use-cases/create-user.use-case'
import { FindAccountUseCase } from '../use-cases/find-account.use-case'
import { extractToken } from '../../../shared/utils/extract-token'
import { UpdateAccountUseCase } from '../use-cases/update-account.use-case'
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto'
import { Account } from '../../../domain/entities/account.entity'

export class AccountController {
  public unprotectedRoutes = ['/account']
  private userUseCase = new CreateUserUseCase()
  private findAccountUseCase = new FindAccountUseCase()
  private updateAccountUseCase = new UpdateAccountUseCase()

  constructor(private server: FastifyInstance) {
    this.userUseCase = new CreateUserUseCase()
    logger.warn('[POST] /account')
    this.server.post('/account', this.createAccount.bind(this))
    logger.warn('[GET] /account/balance')
    this.server.get('/account/balance', this.findBalance.bind(this))
    logger.warn('[POST] /account/deposit')
    this.server.post('/account/deposit', this.updateAccount.bind(this))
  }

  async createAccount(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const body: CreateUserDTO = request.body
    const account = await this.userUseCase.createUser(body)
    reply.send(account)
  }

  async findBalance(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const token = extractToken(request, reply)
    if (!token) return
    const balance = await this.findAccountUseCase.findBalance(token)
    reply.send(balance)
  }

  async updateAccount(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<Pick<Account, 'balance'>> {
    const token = extractToken(request, reply)
    if (!token) return
    const body: UpdateAccountDTO = request.body
    const balance = await this.updateAccountUseCase.updateAccount(body, token)
    reply.send(balance)
  }
}

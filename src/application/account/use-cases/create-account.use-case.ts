import dataSource from '../../../config/datasource.config'
import { Account } from '../../../domain/entities/account.entity'
import { User } from '../../../domain/entities/user.entity'
import { randomNumberUtils } from '../../../shared/utils/generate-random-number'

export class CreateAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)

  async createAccount(user: User): Promise<Account> {
    const dto: Account = {
      accountNumber: await randomNumberUtils.generateRandomNumber(),
      user: user,
    }

    const account = this.accountRepository.create(dto)
    return this.accountRepository.save(account)
  }
}

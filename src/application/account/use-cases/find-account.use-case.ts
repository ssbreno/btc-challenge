import dataSource from '../../../config/datasource.config'
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto'
import { Account } from '../../../domain/entities/account.entity'
import { formatBalanceInBRL } from '../../../shared/utils/format-currency'

interface FormattedAccount {
  balance: string
}

export class FindAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)

   async getAccount(req: any): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: req.account.id },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }

  async findBalance(req: any): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: { id: req.account.id },
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const accountBalance = parseFloat(account.balance.toString())
    const formattedBalance = formatBalanceInBRL(accountBalance)

    const showBalance: FormattedAccount = {
      balance: formattedBalance,
    }

    return showBalance
  }

  async checkAccountBalance(req: any, dto: UpdateAccountDTO): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: { id: req.account.id },
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const balance = Number(account.balance)

    if (balance === 0 && dto.amount < 0) {
      throw new Error('Unsingned balance')
    }
  }
}

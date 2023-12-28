import dataSource from '../../../config/datasource.config'
import { Account } from '../../../domain/entities/account.entity'
import { formatBalanceInBRL } from '../../../shared/utils/format-currency'

interface FormattedAccount {
  balance: string;
}

export class FindAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)

  async findBalance(req: any): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: { id: req.account.id },
    })

    if (!account) {
      throw new Error('Account not found')
    }

    const accountBalance = parseFloat(account.balance.toString());
    const formattedBalance = formatBalanceInBRL(accountBalance);
    
    const showBalance: FormattedAccount = {
      balance: formattedBalance,
    };

    return showBalance
  }
}

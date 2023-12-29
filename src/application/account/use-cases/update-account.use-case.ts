import dataSource from '../../../config/datasource.config'
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto'
import { Account } from '../../../domain/entities/account.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case'
import { FindAccountUseCase } from './find-account.use-case'

export class UpdateAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)
  private findAccountUseCase = new FindAccountUseCase()
  private findTransactionsUseCase = new FindTransactionsUseCase()

  async updateAccount(
    dto: UpdateAccountDTO,
    req: any,
  ): Promise<Pick<Account, 'balance' | 'btcBalance'>> {
    await this.findAccountUseCase.checkAccountBalance(req, dto)
    const lastTransactions =
      await this.findTransactionsUseCase.findLatestTransaction(req, [
        TransactionTypeEnum.BUY,
      ])
    const account = await this.findAccountUseCase.getAccount(req)

    const totalBRLBalance = this.calculateBalance(
      account.balance,
      lastTransactions,
      TransactionTypeEnum.BUY,
      'amount',
    )

    const totalBTCBalance = this.calculateBalance(
      account.btcBalance,
      lastTransactions,
      'BUY_BTC',
      'btcAmount',
    )
    const updatedAccount = await this.updateAccountBalance(
      account,
      totalBRLBalance,
      totalBTCBalance,
    )
    return {
      balance: updatedAccount.balance,
      btcBalance: updatedAccount.btcBalance,
    }
  }

  async updateAccountToSell(
    dto: UpdateAccountDTO,
    req: any,
    type: TransactionTypeEnum,
  ): Promise<Pick<Account, 'balance' | 'btcBalance'>> {
    await this.findAccountUseCase.checkAccountBalance(req, dto)
    const lastTransactions =
      await this.findTransactionsUseCase.findLatestTransaction(req, [
        TransactionTypeEnum.SELL,
        TransactionTypeEnum.PARCIAL_SELL,
      ])
    const account = await this.findAccountUseCase.getAccount(req)
    const totalBRLBalance = this.calculateBalance(
      account.balance,
      lastTransactions,
      type,
      'amount',
    )

    const totalBTCBalance = this.calculateBalance(
      account.btcBalance,
      lastTransactions,
      type,
      'btcAmount',
    )
    const updatedAccount = await this.updateAccountBalance(
      account,
      totalBRLBalance,
      totalBTCBalance,
    )
    return {
      balance: updatedAccount.balance,
      btcBalance: updatedAccount.btcBalance,
    }
  }

  private calculateBalance(
    currentBalance: number,
    lastTransaction: any,
    transactionType: string,
    key: string,
  ): number {
    if (!lastTransaction) {
      throw new Error('No recent transaction found')
    }

    const transactionValue = Number(lastTransaction[key])

    let totalBalance
    switch (transactionType) {
      case 'BUY_BTC':
        totalBalance = currentBalance + transactionValue
        break
      case TransactionTypeEnum.BUY:
        totalBalance = currentBalance - transactionValue
        break
      case TransactionTypeEnum.SELL:
        totalBalance = currentBalance + transactionValue
        break
      case TransactionTypeEnum.PARCIAL_SELL:
        totalBalance = currentBalance + transactionValue
        break
      case TransactionTypeEnum.WITHDRAW:
        totalBalance = currentBalance - transactionValue
        break
      default:
        throw new Error('Invalid transaction type')
    }

    return totalBalance
  }

  private async updateAccountBalance(
    account: Account,
    newBalance: number,
    newBTCBalance: number,
  ): Promise<Account> {
    const updatedAccount = {
      ...account,
      balance: newBalance,
      btcBalance: newBTCBalance,
    }
    return this.accountRepository.save(updatedAccount)
  }
}

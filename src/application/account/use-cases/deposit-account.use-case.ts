import dataSource from '../../../config/datasource.config'
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto'
import { Account } from '../../../domain/entities/account.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { sendEmail } from '../../../infrastructure/email/use-case/email.use-case'
import { formatBalanceInBRL } from '../../../shared/utils/format-currency'
import { CreateTransactionsUseCase } from '../../transactions/use-cases/create-transactions.use-case'
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case'
import { FindAccountUseCase } from './find-account.use-case'

export class DepositAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)
  private createTransactionsUseCase = new CreateTransactionsUseCase()
  private findTransactionsUseCase = new FindTransactionsUseCase()
  private findAccountUseCase = new FindAccountUseCase()

  async execute(
    dto: UpdateAccountDTO,
    req: any,
  ): Promise<Pick<Account, 'balance'>> {
    this.validateDepositAmount(dto.amount)
    await this.findAccountUseCase.checkAccountBalance(req, dto)

    const account = await this.findAccountUseCase.getAccount(req)
    await this.createDepositTransaction(dto.amount, account)

    const totalAmount = await this.calculateTotalAmount(req)
    const updatedAccount = await this.updateAccountBalance(account, totalAmount)

    await this.sendDepositConfirmationEmail(
      req.name,
      dto.amount,
      updatedAccount.balance,
    )
    return { balance: updatedAccount.balance }
  }

  private validateDepositAmount(amount: number) {
    if (amount < 0) {
      throw new Error('It is not possible to deposit negative values')
    }
  }

  private async createDepositTransaction(amount: number, account: Account) {
    const transaction = {
      type: TransactionTypeEnum.DEPOSIT,
      amount,
    }
    await this.createTransactionsUseCase.createTransactions(
      transaction,
      account,
    )
  }

  private async calculateTotalAmount(req: any): Promise<number> {
    const transactions =
      await this.findTransactionsUseCase.findTransactions(req)
    const totalAmount = transactions.reduce((accumulator, transaction) => {
      return accumulator + Number(transaction.amount)
    }, 0)
    return totalAmount
  }

  private async updateAccountBalance(
    account: Account,
    newBalance: number,
  ): Promise<Account> {
    return this.accountRepository.save({ ...account, balance: newBalance })
  }

  private async sendDepositConfirmationEmail(
    userName: string,
    amount: number,
    balance: number,
  ) {
    const formattedBalance = formatBalanceInBRL(balance)
    await sendEmail(
      'ssobralbreno@gmail.com',
      'Deposit Confirmation',
      'deposit-template',
      { user: userName, amount, formattedBalance },
    )
  }
}

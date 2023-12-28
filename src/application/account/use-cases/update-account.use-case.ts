import dataSource from '../../../config/datasource.config'
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto'
import { Account } from '../../../domain/entities/account.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { sendEmail } from '../../../infrastructure/email/use-case/email.use-case'
import { CreateTransactionsUseCase } from '../../transactions/use-cases/create-transactions.use-case'
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case'
import { FindAccountUseCase } from './find-account.use-case'

export class UpdateAccountUseCase {
  private accountRepository = dataSource.getRepository(Account)
  private createTransactionsUseCase = new CreateTransactionsUseCase()
  private findTransactionsUseCase = new FindTransactionsUseCase()
  private findAccountUseCase = new FindAccountUseCase()

  async updateAccount(dto: UpdateAccountDTO, req: any): Promise<Pick<Account, 'balance'>> {
    await this.findAccountUseCase.checkAccountBalance(req, dto)

    if (dto.amount < 0) {
      throw new Error('It is not possible to deposit negative values');
    }
    
    const account = await this.accountRepository.findOne({
      where: { id: req.account.id },
    })

    if (account) {
      const createTransactions = {
        type: TransactionTypeEnum.DEPOSIT,
        amount: dto.amount,
      }
      this.createTransactionsUseCase.createTransactions(
        createTransactions,
        account,
      )
    }

    const transactions =
      await this.findTransactionsUseCase.findTransactions(req)

    const totalAmount = transactions.reduce((accumulator, transaction) => {
      return accumulator + Number(transaction.amount)
    }, 0)

    const updatedBankAccount: Partial<Account> = {
      ...account,
      balance: totalAmount,
    }

    const pickBalance : Pick<Account, 'balance'> =  await this.accountRepository.save(updatedBankAccount);
    await sendEmail('ssobralbreno@gmail.com', 'Deposit Confirmation', 'deposit-template', { user: req.name, amount: dto.amount, balance: updatedBankAccount.balance });
    return pickBalance;
  }
}

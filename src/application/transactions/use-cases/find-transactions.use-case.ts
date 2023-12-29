import { Between, In } from 'typeorm'
import dataSource from '../../../config/datasource.config'
import { Transaction } from '../../../domain/entities/transactions.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { startOfDay, endOfDay } from 'date-fns'

export class FindTransactionsUseCase {
  private transactionsRepository = dataSource.getRepository(Transaction)

  async findTransactions(req: any): Promise<any> {
    const account = await this.transactionsRepository.find({
      where: { account: { id: req.account.id } },
      relations: ['account'],
    })

    if (!account) {
      throw new Error('Transactions not found')
    }

    return account
  }

  async findLatestTransaction(
    req: any,
    type: TransactionTypeEnum[],
  ): Promise<any> {
    const findLatestTransaction = await this.transactionsRepository.findOne({
      where: {
        account: { id: req.account.id },
        type: In(type),
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return findLatestTransaction
  }

  async fetchTransactionsDateRange(
    type: TransactionTypeEnum[],
  ): Promise<Transaction[]> {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    return this.transactionsRepository.find({
      where: {
        type: In(type),
        createdAt: Between(todayStart, todayEnd),
      },
    })
  }
}

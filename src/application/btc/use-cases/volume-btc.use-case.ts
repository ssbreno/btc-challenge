import { Between } from 'typeorm'
import dataSource from '../../../config/datasource.config'
import { Transaction } from '../../../domain/entities/transactions.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { startOfDay, endOfDay } from 'date-fns'

export class VolumeBTCUseCase {
  private transactionsRepository = dataSource.getRepository(Transaction)

  async execute(): Promise<any> {
    const buyTransactions = await this.fetchTransactions(
      TransactionTypeEnum.BUY,
    )
    const sellTransactions = await this.fetchTransactions(
      TransactionTypeEnum.SELL,
    )

    const totalBoughtBtc = buyTransactions.reduce(
      (acc, t) => acc + Number(t.btcAmount || 0),
      0,
    )
    const totalSoldBtc = sellTransactions.reduce(
      (acc, t) => acc + Number(t.btcAmount || 0),
      0,
    )

    return {
      totalBoughtBtc,
      totalSoldBtc,
    }
  }

  private async fetchTransactions(
    type: TransactionTypeEnum,
  ): Promise<Transaction[]> {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    return this.transactionsRepository.find({
      where: {
        type: type,
        createdAt: Between(todayStart, todayEnd),
      },
    })
  }
}

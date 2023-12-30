import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case'

export class VolumeBTCUseCase {
  private findTransactionsUseCase = new FindTransactionsUseCase()

  async execute(): Promise<any> {
    const buyTransactions =
      await this.findTransactionsUseCase.fetchTransactionsDateRange([
        TransactionTypeEnum.BUY,
      ])
    const sellTransactions =
      await this.findTransactionsUseCase.fetchTransactionsDateRange([
        TransactionTypeEnum.SELL,
        TransactionTypeEnum.PARCIAL_SELL,
      ])

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
}

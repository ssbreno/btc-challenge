import dataSource from '../../../config/datasource.config'
import { Transaction } from '../../../domain/entities/transactions.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'

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

  async findLatestBuyTransaction(req: any): Promise<any> {
    const latestBuyTransaction = await this.transactionsRepository.findOne({
      where: {
        account: { id: req.account.id },
        type: TransactionTypeEnum.BUY,
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return latestBuyTransaction
  }
}

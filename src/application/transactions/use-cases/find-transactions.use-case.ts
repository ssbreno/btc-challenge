import dataSource from '../../../config/datasource.config'
import { Transaction } from '../../../domain/entities/transactions.entity'

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
}

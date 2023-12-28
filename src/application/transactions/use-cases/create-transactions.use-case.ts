import dataSource from '../../../config/datasource.config'
import { CreateTransactionsDTO } from '../../../domain/dtos/transactions/create-transactions.dto'
import { Account } from '../../../domain/entities/account.entity'
import { Transaction } from '../../../domain/entities/transactions.entity'

export class CreateTransactionsUseCase {
  private transactionsRepository = dataSource.getRepository(Transaction)

  async createTransactions(
    dto: CreateTransactionsDTO,
    account: Account,
  ): Promise<Transaction> {
    const updatedTransactions = {
      type: dto.type,
      amount: dto.amount,
      btcPriceAtTransaction: dto.btcPriceAtTransaction,
      btcAmount: dto.btcAmount,
      account: account,
    }
    const transactional: Partial<Transaction> = { ...updatedTransactions }
    try {
      const transactionsCreated =
        this.transactionsRepository.create(transactional)
      return this.transactionsRepository.save(transactionsCreated)
    } catch (error) {
      throw new Error('Error on create transactions')
    }
  }
}

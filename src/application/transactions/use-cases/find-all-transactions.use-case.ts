import dataSource from '../../../config/datasource.config'
import { FindAllTransactionsDTO } from '../../../domain/dtos/transactions/find-all-transactions.dto'
import { Transaction } from '../../../domain/entities/transactions.entity'
import { subDays } from 'date-fns'
import { Pagination } from '../../../shared/@types/pagination-type'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'

export class FindAllTransactionsUseCase {
  private transactionsRepository = dataSource.getRepository(Transaction)

  async findAllTransactions(
    dto: FindAllTransactionsDTO,
    req: any,
  ): Promise<Pagination<any>> {
    const take = dto.take || 12
    const page = dto.page || 1
    const skip = (page - 1) * take

    const queryBuilder = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .where('transaction.type IN (:...types)', {
        types: [
          TransactionTypeEnum.BUY,
          TransactionTypeEnum.DEPOSIT,
          TransactionTypeEnum.WITHDRAW,
        ],
      })
      .andWhere('account.id = :id', { id: req.account.id })

    const defaultStartDate = subDays(new Date(), 90)
    const startDate = dto.startDate || defaultStartDate
    const endDate = dto.endDate || new Date()

    const order = dto.asc === 'ASC' ? 'ASC' : 'DESC'
    const orderMapping = {
      type: 'transactions.type',
    }

    queryBuilder.andWhere(
      'transaction.createdAt BETWEEN :startDate AND :endDate',
      { startDate, endDate },
    )

    if (dto.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: dto.type })
    }

    if (dto.sortBy in orderMapping) {
      queryBuilder.orderBy(orderMapping[dto.sortBy], order)
    }

    queryBuilder.take(take).skip(skip)
    const [result, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / take)

    return {
      data: result,
      count: total,
      totalPages,
      actualPage: dto.page,
    }
  }
}

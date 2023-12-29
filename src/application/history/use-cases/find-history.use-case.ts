import { MoreThanOrEqual } from 'typeorm'
import { startOfMinute, subDays } from 'date-fns'
import dataSource from '../../../config/datasource.config'
import { History } from '../../../domain/entities/history.entity'

export class FindHistoryUseCase {
  private historyRepository = dataSource.getRepository(History)

  async execute(): Promise<any> {
    const fromDate = startOfMinute(subDays(new Date(), 1))
    const history = await this.historyRepository.find({
      where: {
        createdAt: MoreThanOrEqual(fromDate),
      },
    })

    return history
  }
}

import { subDays } from 'date-fns'
import dataSource from '../../../config/datasource.config'
import { History } from '../../../domain/entities/history.entity'

export class DeleteHistoryUseCase {
  private historyRepository = dataSource.getRepository(History)

  async deleteHistory(): Promise<any> {
    try {
      const ninetyDaysAgo = subDays(new Date(), 90)
      await this.historyRepository
        .createQueryBuilder()
        .delete()
        .where('createdAt < :ninetyDaysAgo', { ninetyDaysAgo })
        .execute()
    } catch (error) {
      throw new Error('Error on create history')
    }
  }
}

import dataSource from '../../../config/datasource.config'
import { CreateHistoryDTO } from '../../../domain/dtos/history/create-history.dto'
import { History } from '../../../domain/entities/history.entity'

export class CreateHistoryUseCase {
  private historyRepository = dataSource.getRepository(History)

  async createHistory(dto: Partial<CreateHistoryDTO>): Promise<History> {
    const createHistoryDTO = {
      sellPrice: dto?.sellPrice || null,
      buyPrice: dto?.buyPrice || null,
    }
    const createHistory: Partial<History> = { ...createHistoryDTO }
    try {
      const historyCreated = this.historyRepository.create(createHistory)
      return this.historyRepository.save(historyCreated)
    } catch (error) {
      throw new Error('Error on create history')
    }
  }
}

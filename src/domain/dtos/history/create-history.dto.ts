import { IsDecimal, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateHistoryDTO {
  @IsDecimal()
  @IsNotEmpty()
  buyPrice?: number

  @IsDecimal()
  @IsOptional()
  sellPrice?: number
}

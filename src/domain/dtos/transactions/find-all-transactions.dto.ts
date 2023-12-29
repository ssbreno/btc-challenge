import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { TransactionTypeEnum } from '../../enums/transaction-type.enum'

export class FindAllTransactionsDTO {
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date

  @IsOptional()
  @IsEnum(TransactionTypeEnum)
  type?: TransactionTypeEnum

  @IsString()
  @IsOptional()
  sortBy?: string

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  take?: number

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number

  @IsString()
  @IsOptional()
  asc?: string
}

import { IsDecimal, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { TransactionTypeEnum } from '../../enums/transaction-type.enum'

export class CreateTransactionsDTO {
  @IsNotEmpty()
  @IsEnum(TransactionTypeEnum)
  type?: TransactionTypeEnum

  @IsDecimal()
  @IsNotEmpty()
  amount?: number

  @IsDecimal()
  @IsOptional()
  btcPriceAtTransaction?: number

  @IsDecimal()
  @IsOptional()
  btcAmount?: number
}

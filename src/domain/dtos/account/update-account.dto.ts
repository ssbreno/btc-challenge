import { IsDecimal, IsNotEmpty } from 'class-validator'

export class UpdateAccountDTO {
  @IsDecimal()
  @IsNotEmpty()
  amount?: number
}

import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator'

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  email?: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password?: string
}

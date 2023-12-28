import { IsString, IsEmail, Length } from 'class-validator'

export class CreateUserDTO {
  @IsString()
  @Length(1, 250)
  name?: string

  @IsEmail()
  @Length(1, 100)
  email?: string

  @IsString()
  @Length(8, 50)
  password?: string
}

import dataSource from '../../../config/datasource.config'
import { CreateUserDTO } from '../../../domain/dtos/user/create-user.dto'
import { User } from '../../../domain/entities/user.entity'
import { passwordUtils } from '../../../shared/utils/generate-random-password'
import { CreateAccountUseCase } from '../../account/use-cases/create-account.use-case'
import { FindUserUseCase } from './find-user.use-case'

export class CreateUserUseCase {
  private userRepository = dataSource.getRepository(User)
  private createAccountUseCase = new CreateAccountUseCase()
  private findUserUseCase = new FindUserUseCase()

  async createUser(userData: Partial<CreateUserDTO>): Promise<User> {
    await this.findUserUseCase.findExistingUser(userData.email)
    const hashedPassword = await passwordUtils.generateRandomPassword(
      userData.password,
    )
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    })

    try {
      const savedUser = await this.userRepository.save(newUser)
      await this.createAccountUseCase.createAccount(savedUser)
      return savedUser
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
  }
}

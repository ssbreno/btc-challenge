import dataSource from '../../../config/datasource.config'
import { User } from '../../../domain/entities/user.entity'

export class FindUserUseCase {
  private userRepository = dataSource.getRepository(User)

  async findUser(id: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async findExistingUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } })

    console.log(user)

    if (user) {
      throw new Error('User already exists with this email')
    }

    return user
  }
}

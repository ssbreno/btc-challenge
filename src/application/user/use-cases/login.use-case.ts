import dataSource from '../../../config/datasource.config'
import { AuthDTO } from '../../../domain/dtos/auth/auth.dto'
import { User } from '../../../domain/entities/user.entity'
import { bcryptUtils } from '../../../shared/utils/bcrypt-hash'
import { tokenGenerator } from '../../../shared/utils/generate-token'

export class LoginUseCase {
  private userRepository = dataSource.getRepository(User)

  async login(dto: AuthDTO): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['account'],
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!(await bcryptUtils.compare(dto.password, user.password))) {
      throw new Error('Incorrect password')
    }

    return {
      token: await tokenGenerator.generateToken({ ...user }, false),
      refresh_token: await tokenGenerator.generateToken({ ...user }, true),
    }
  }
}

import { FindUserUseCase } from '../../../../../src/application/user/use-cases/find-user.use-case'
import dataSource from '../../../../../src/config/datasource.config'
import { User } from '../../../../../src/domain/entities/user.entity'

jest.mock('../../../../../src/config/datasource.config', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
  }),
}))

describe('FindUserUseCase', () => {
  let findUserUseCase
  let mockUserRepository

  beforeEach(() => {
    mockUserRepository = dataSource.getRepository(User)
    findUserUseCase = new FindUserUseCase()
  })

  it('should find an existing user by ID', async () => {
    const mockUser = new User()
    mockUser.id = '1'
    mockUserRepository.findOne.mockResolvedValue(mockUser)

    const result = await findUserUseCase.findUser('1')

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    })
    expect(result).toEqual(mockUser)
  })

  it('should throw an error if no user is found by ID', async () => {
    mockUserRepository.findOne.mockResolvedValue(null)

    await expect(findUserUseCase.findUser('1')).rejects.toThrow(
      'User not found',
    )
  })

  it('should find an existing user by email', async () => {
    const mockUser = new User()
    mockUser.email = 'test@example.com'
    mockUserRepository.findOne.mockResolvedValue(mockUser)

    await expect(
      findUserUseCase.findExistingUser('test@example.com'),
    ).rejects.toThrow('User already exists with this email')
  })

  it('should not find any user by email (user does not exist)', async () => {
    mockUserRepository.findOne.mockResolvedValue(null)

    const result = await findUserUseCase.findExistingUser('test@example.com')
    expect(result).toBeNull()
  })
})

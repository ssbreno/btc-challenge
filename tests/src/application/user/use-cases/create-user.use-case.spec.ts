import dataSource from '../../../../../src/config/datasource.config'
import { CreateUserUseCase } from '../../../../../src/application/user/use-cases/create-user.use-case'
import { User } from '../../../../../src/domain/entities/user.entity'
import { CreateAccountUseCase } from '../../../../../src/application/account/use-cases/create-account.use-case'
import { UserMock } from '../../../../mocks/users'

jest.mock('../../../../../src/config/datasource.config', () => ({
  getRepository: jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
  }),
}))

jest.mock('../../../../../src/shared/utils/generate-random-password', () => ({
  passwordUtils: {
    generateRandomPassword: jest.fn().mockResolvedValue('hashedPassword'),
  },
}))

jest.mock(
  '../../../../../src/application/account/use-cases/create-account.use-case',
)
jest.mock(
  '../../../../../src/application/user/use-cases/find-user.use-case',
  () => ({
    FindUserUseCase: jest.fn().mockImplementation(() => ({
      findExistingUser: jest.fn().mockResolvedValue(null),
    })),
  }),
)

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase
  let mockUserRepository: any

  beforeEach(() => {
    mockUserRepository = dataSource.getRepository(User)
    createUserUseCase = new CreateUserUseCase()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined()
  })

  it('should successfully create a new user and account', async () => {
    const userData = UserMock()
    const createdUser = new User()
    createdUser.id = 'some-id'
    createdUser.email = userData.email

    mockUserRepository.create.mockReturnValue(createdUser)
    mockUserRepository.save.mockResolvedValue(createdUser)

    const result = await createUserUseCase.createUser(userData)

    expect(result).toEqual(createdUser)
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...userData,
      password: 'hashedPassword',
    })
    expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser)
    expect(CreateAccountUseCase.prototype.createAccount).toHaveBeenCalledWith(
      createdUser,
    )
  })
})

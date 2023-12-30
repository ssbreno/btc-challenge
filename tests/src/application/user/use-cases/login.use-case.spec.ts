import dataSource from '../../../../../src/config/datasource.config'
import { User } from '../../../../../src/domain/entities/user.entity'
import { LoginUseCase } from '../../../../../src/application/user/use-cases/login.use-case'
import { bcryptUtils } from '../../../../../src/shared/utils/bcrypt-hash'

jest.mock('../../../../../src/config/datasource.config', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue({}),
  }),
}))

jest.mock('../../../../../src/shared/utils/bcrypt-hash', () => ({
  bcryptUtils: {
    compare: jest.fn().mockResolvedValue(true),
  },
}))

jest.mock('../../../../../src/shared/utils/generate-token', () => ({
  tokenGenerator: {
    generateToken:  jest.fn().mockResolvedValue('token'),
  },
}))

describe('LoginUseCase', () => {
  let loginUseCase;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = dataSource.getRepository(User)
    loginUseCase = new LoginUseCase()
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(loginUseCase).toBeDefined()
  })

  it('should successfully login with valid credentials', async () => {
    const mockUser = new User();
    mockUser.email = 'test@example.com';
    mockUser.password = 'hashedPassword';
    mockUserRepository.findOne.mockResolvedValue(mockUser);


    const dto = { email: 'test@example.com', password: 'password' };
    const result = await loginUseCase.login(dto);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      relations: ['account'],
    });
    expect(bcryptUtils.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(result).toEqual({
      token: 'token',
      refresh_token: 'token',
    });
  });

  it('should throw an error if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null)
    const dto = { email: 'test@example.com', password: 'password' }
    await expect(loginUseCase.login(dto)).rejects.toThrow('User not found')
  })

  it('should throw an error if password is incorrect', async () => {
    const mockUser = new User();
    mockUser.email = 'test@example.com';
    mockUser.password = 'hashedPassword';
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    (bcryptUtils.compare as jest.Mock).mockReturnValue(false)

    const dto = { email: 'test@example.com', password: 'wrongpassword' };

    await expect(loginUseCase.login(dto)).rejects.toThrow('Incorrect password');
  });

  
})

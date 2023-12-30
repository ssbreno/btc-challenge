import { bcryptUtils } from '../../../../src/shared/utils/bcrypt-hash'
import { hashSync } from 'bcryptjs'
import { passwordUtils } from '../../../../src/shared/utils/generate-random-password'

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}))

jest.mock('../../../../src/shared/utils/bcrypt-hash', () => ({
  bcryptUtils: { genSalt: jest.fn().mockReturnValue('mockedSalt') },
}))

describe('Password Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a random password', async () => {
    const testString = 'randomString'
    const mockedSalt = 'mockedSalt'
    const mockedHashedPassword = 'hashedPassword'

    const result = await passwordUtils.generateRandomPassword(testString)
    expect(result).toBe(mockedHashedPassword)
    expect(bcryptUtils.genSalt).toHaveBeenCalled()
    expect(hashSync).toHaveBeenCalledWith(testString, mockedSalt)
  })
})

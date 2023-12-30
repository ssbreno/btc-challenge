import bcrypt from 'bcryptjs'
import { bcryptUtils } from '../../../../src/shared/utils/bcrypt-hash'

jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn().mockReturnValue('mockedSalt'),
  compareSync: jest.fn().mockReturnValue(true),
}))

describe('Bcrypt Utils', () => {
  it('genSalt should generate salt correctly', async () => {
    const salt = await bcryptUtils.genSalt()
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10)
    expect(salt).toBe('mockedSalt')
  })

  it('compare should compare hash correctly', async () => {
    const result = await bcryptUtils.compare('plaintext', 'hashed')
    expect(bcrypt.compareSync).toHaveBeenCalledWith('plaintext', 'hashed')
    expect(result).toBe(true)
  })
})

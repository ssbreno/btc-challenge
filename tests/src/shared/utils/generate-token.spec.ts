import jwt from 'jsonwebtoken'
import { tokenGenerator } from '../../../../src/shared/utils/generate-token'

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

describe('TokenGenerator', () => {
  it('should generate an access token with correct expiry', () => {
    process.env.JWT_SECRET = 'secret'
    process.env.JWT_EXPIRES_IN_ACCESS_TOKEN = '1h'
    tokenGenerator.generateToken({ user: 'test' }, false)
    expect(jwt.sign).toHaveBeenCalledWith({ user: 'test' }, 'secret', {
      expiresIn: '1h',
    })
  })

  it('should generate a refresh token with correct expiry', () => {
    process.env.JWT_SECRET = 'secret'
    process.env.JWT_EXPIRES_IN_REFRESH_TOKEN = '7d'
    tokenGenerator.generateToken({ user: 'test' }, true)
    expect(jwt.sign).toHaveBeenCalledWith({ user: 'test' }, 'secret', {
      expiresIn: '7d',
    })
  })
})

import jwt from 'jsonwebtoken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { authUtils } from '../../../../src/shared/utils/extract-token'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

describe('Auth Utils', () => {
  const mockRequest = {
    headers: {
      authorization: 'Bearer mockedToken',
    },
  } as unknown as FastifyRequest
  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as FastifyReply

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract token correctly', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' })

    const result = authUtils.extractToken(mockRequest, mockReply)

    expect(result).toEqual({ userId: '123' })
    expect(jwt.verify).toHaveBeenCalledWith(
      'mockedToken',
      process.env.JWT_SECRET,
    )
  })

  it('should handle missing authorization header', () => {
    const result = authUtils.extractToken(
      { headers: {} } as FastifyRequest,
      mockReply,
    )

    expect(result).toBeNull()
    expect(mockReply.code).toHaveBeenCalledWith(401)
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Authorization token is required',
    })
  })

  it('should handle invalid token', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const result = authUtils.extractToken(mockRequest, mockReply)

    expect(result).toBeNull()
    expect(mockReply.code).toHaveBeenCalledWith(401)
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    })
  })
})

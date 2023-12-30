import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export interface IAuthUtils {
  extractToken(request: FastifyRequest, reply: FastifyReply): any
}

export const authUtils: IAuthUtils = {
  extractToken: (request: FastifyRequest, reply: FastifyReply): any => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      reply.code(401).send({ error: 'Authorization token is required' })
      return null
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      reply.code(401).send({ error: 'Bearer token is missing' })
      return null
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)
      return decodedToken
    } catch (error) {
      reply.code(401).send({ error: 'Invalid or expired token' })
      return null
    }
  },
}

import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw new Error('No token provided')
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (error) {
    reply.code(401).send({ message: 'Unauthorized' })
    throw new Error('Unauthorized')
  }
}

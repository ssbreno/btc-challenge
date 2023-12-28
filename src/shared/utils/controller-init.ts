import { FastifyInstance } from 'fastify'
import { authGuard } from '../../infrastructure/auth/guards/jwt.guard'

export const initializeControllers = (
  server: FastifyInstance,
  controllers: any[],
) => {
  let allUnprotectedRoutes: string[] = []

  controllers.forEach((Controller) => {
    const controller = new Controller(server)
    allUnprotectedRoutes = [
      ...allUnprotectedRoutes,
      ...(controller.unprotectedRoutes || []),
    ]
  })

  server.addHook('preHandler', async (request, reply) => {
    if (allUnprotectedRoutes.includes(request.routerPath)) {
      return
    }
    return authGuard(request, reply)
  })
}

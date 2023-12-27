import { FastifyInstance } from 'fastify';

export const initializeControllers = (server: FastifyInstance, controllers: any[]) => {
  controllers.forEach((Controller) => {
    new Controller(server);
  });
};

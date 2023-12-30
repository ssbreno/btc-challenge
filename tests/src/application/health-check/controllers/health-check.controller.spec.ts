import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HealthCheck } from '../../../../../src/application/health-check/use-cases/health-check.use-case';
import { HealthCheckController } from '../../../../../src/application/health-check/controllers/health-check.controller';
import { logger } from '../../../../../src/shared/loggers/logger';

jest.mock('../../../../../src/application/health-check/use-cases/health-check.use-case');
jest.mock('../../../../../src/shared/loggers/logger');

describe('HealthCheckController', () => {
  let server: FastifyInstance;
  let healthCheck: HealthCheck;

  beforeEach(() => {
    server = {
      get: jest.fn()
    } as unknown as FastifyInstance;

    healthCheck = new HealthCheck();
    (HealthCheck as jest.Mock).mockImplementation(() => ({
      check: jest.fn().mockResolvedValue({ status: 'ok' })
    }));

    new HealthCheckController(server);
  });

  it('should add /health-check route', () => {
    expect(server.get).toHaveBeenCalledWith('/health-check', expect.any(Function));
  });
});

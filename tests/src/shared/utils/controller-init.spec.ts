
import fastify from 'fastify';
import { initializeControllers } from '../../../../src/shared/utils/controller-init';
import { authGuard } from '../../../../src/infrastructure/auth/guards/jwt.guard';

jest.mock('../../../../src/infrastructure/auth/guards/jwt.guard', () => ({
  authGuard: jest.fn(),
}));

describe('initializeControllers', () => {
  let server;
  let mockController;

  beforeEach(() => {
    server = fastify();
    server.addHook = jest.fn();
    mockController = jest.fn().mockImplementation(() => ({
      unprotectedRoutes: ['/public-route'],
    }));
  });

  it('should initialize controllers and set up preHandler hook', () => {
    initializeControllers(server, [mockController]);

    expect(mockController).toHaveBeenCalled();
    expect(server.addHook).toHaveBeenCalledWith('preHandler', expect.any(Function));
  });

  it('should call authGuard for protected routes', async () => {
    initializeControllers(server, [mockController]);

    const preHandlerHook = server.addHook.mock.calls[0][1];
    const mockRequest = { routerPath: '/protected-route' };
    const mockReply = {};

    await preHandlerHook(mockRequest, mockReply);

    expect(authGuard).toHaveBeenCalledWith(mockRequest, mockReply);
  });

  
});

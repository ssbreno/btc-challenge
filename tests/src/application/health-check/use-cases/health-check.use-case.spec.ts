
import { HealthCheck } from '../../../../../src/application/health-check/use-cases/health-check.use-case';

describe('HealthCheck', () => {
  let healthCheck;

  beforeEach(() => {
    healthCheck = new HealthCheck();
  });

  it('should return status ok', async () => {
    const result = await healthCheck.check();
    expect(result).toEqual({ status: 'ok' });
  });
});

export class HealthCheck {
  async check(): Promise<{ status: string }> {
    return { status: 'ok' }
  }
}

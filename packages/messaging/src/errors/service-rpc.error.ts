import { RpcException } from '@nestjs/microservices';

export type ServiceErrorCode =
  'VALIDATION_ERROR' | 'CONFLICT' | 'NOT_FOUND' | 'FORBIDDEN';

export class ServiceRpcException extends RpcException {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super({ code, message, meta });
  }
}

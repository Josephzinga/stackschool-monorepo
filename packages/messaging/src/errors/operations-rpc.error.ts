import { RpcException } from '@nestjs/microservices';

export type OperationsErrorCode =
  | 'INTERNAL_ERROR'
  | 'VALIDATION_ERROR'
  | 'DB_ERROR'
  | 'CONFLICT'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

export class OperationsRpcException extends RpcException {
  constructor(
    public readonly code: OperationsErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super({ code, message, meta });
  }
}

import { RpcException } from '@nestjs/microservices';

export type CoreErrorCode =
  | 'SCHOOL_NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'VALIDATION_ERROR';

export class CoreRpcException extends RpcException {
  constructor(
    public readonly code: CoreErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super({ code, message, meta });
  }
}

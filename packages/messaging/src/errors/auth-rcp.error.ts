import { RpcException } from '@nestjs/microservices';

export type AuthErrorCode =
  | 'EMAIL_TAKEN'
  | 'USERNAME_TAKEN'
  | 'PHONE_TAKEN'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'SOCIAL_ONLY_ACCOUNT'
  | 'INTERNAL_ERROR'
  | 'VALIDATION_ERROR'
  | 'TOO_MANY_REQUEST';

export class AuthRpcException extends RpcException {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super({ code, message, meta });
  }
}

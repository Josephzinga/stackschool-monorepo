import { RpcException } from '@nestjs/microservices';

export type AcademicErrorCode =
  | 'INTERNAL_ERROR'
  | 'VALIDATION_ERROR'
  | 'SCHOOL_ID_NOT_FOUND'
  | 'DB_ERROR'
  | 'CLASS_ALREADY_EXISTS'
  | 'CONFLICT'
  | 'SUBJECT_ALREADY_EXIST'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'SUBJECT_NOT_FOUND';

export class AcademicRpcException extends RpcException {
  constructor(
    public readonly code: AcademicErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super({ code, message, meta });
  }
}

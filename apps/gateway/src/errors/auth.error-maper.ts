import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthErrorCode } from '@stackschool/messaging';
import { ZodError } from 'zod';

export function mapAuthError(payload: {
  code?: AuthErrorCode;
  message: string;
  meta?: any;
}) {
  if (payload instanceof ZodError) {
    return new BadRequestException(payload.message);
  }

  switch (payload?.code) {
    case 'EMAIL_TAKEN':
    case 'USERNAME_TAKEN':
    case 'PHONE_TAKEN':
      return new ConflictException(payload.message);
    case 'USER_NOT_FOUND':
      return new NotFoundException(payload.message);
    case 'INVALID_CREDENTIALS':
      return new BadRequestException(payload.message);
    case 'SOCIAL_ONLY_ACCOUNT':
      return new UnauthorizedException({
        message: payload.message,
        ...payload.meta,
      });
    case 'VALIDATION_ERROR':
      return new BadRequestException(payload.message);
    default:
      return new ServiceUnavailableException('Erreur du service auth.');
  }
}

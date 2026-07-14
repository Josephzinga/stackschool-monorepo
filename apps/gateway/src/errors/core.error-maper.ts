import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthErrorCode } from '@stackschool/messaging';
import { ZodError } from 'zod';

export function mapCoreError(payload: {
  code?: string;
  message: string;
  meta?: any;
}) {
  if (payload instanceof ZodError) {
    return new BadRequestException(payload.message);
  }

  switch (payload?.code) {
    case 'MEMBERSHIP_NOT_FOUND':
      return new BadRequestException(payload.message);
    default:
      return new ServiceUnavailableException('Erreur du service auth.');
  }
}

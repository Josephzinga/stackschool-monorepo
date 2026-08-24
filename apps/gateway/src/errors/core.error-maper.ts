import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CoreErrorCode } from '@stackschool/messaging';
import { ZodError } from 'zod';

export function mapCoreError(payload: {
  code?: CoreErrorCode;
  message: string;
  meta?: any;
}) {
  if (payload instanceof ZodError) {
    return new BadRequestException(payload.message);
  }
  console.log(payload);
  switch (payload?.code) {
    case 'MEMBERSHIP_NOT_FOUND':
    case 'SCHOOL_NOT_FOUND':
      return new NotFoundException(payload.message);
    case 'INTERNAL_ERROR':
    case 'DB_ERROR':
      return new InternalServerErrorException(payload.message);
    case 'MEMBERSHIP_ALREADY_EXIST':
      return new ConflictException(payload.message);
    case 'FORBIDDEN':
      return new ForbiddenException(payload.message);
    case 'AUTH_SERVICE_ERROR':
      return new ServiceUnavailableException(payload.message);
    default:
      throw new ServiceUnavailableException('Erreur du service core.');
  }
}

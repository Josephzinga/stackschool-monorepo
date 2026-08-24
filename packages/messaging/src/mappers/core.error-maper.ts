import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {CoreErrorCode} from '../errors/core-rpc.error.ts';
import {ZodError} from 'zod';

export function mapCoreError(payload: {
  code?: CoreErrorCode;
  message: string;
  meta?: any;
}) {
  if (payload instanceof ZodError) {
    return new BadRequestException(payload.message);
  }

  switch (payload?.code) {
    case 'MEMBERSHIP_NOT_FOUND':
      return new BadRequestException(payload.message);
    case 'INTERNAL_ERROR':
      return new InternalServerErrorException(payload.message);
    case 'MEMBERSHIP_ALREADY_EXIST':
      return new ConflictException(payload.message);
    case 'SCHOOL_NOT_FOUND':
      return new NotFoundException(payload.message);
    default:
      return new ServiceUnavailableException('Erreur du service core.');
  }
}

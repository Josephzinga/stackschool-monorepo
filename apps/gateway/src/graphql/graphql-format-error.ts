import { GraphQLFormattedError } from 'graphql/error';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export const formatedError = (err: GraphQLFormattedError) => {
  if (err instanceof HttpException) {
    return {
      ok: false,
      message: err.message ?? '',
      statusCode: err.getStatus() || 500,
      name: 'SERVICE_ERROR',
    };
  }
  if (err instanceof ZodError) {
    return {
      ok: 'false',
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Erreur de validation',
      name: 'VALIDATION_ERROR',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    };
  }
  return {
    message: err.message || 'Une erreur interne est survenue',
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    name: 'INTERNAL_SERVER_ERROR',
  };
};

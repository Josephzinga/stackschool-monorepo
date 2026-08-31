import { GraphQLErrorExtensions, GraphQLFormattedError } from 'graphql';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodError } from 'zod';

interface GraphqlReturnError {
  ok: boolean;
  message: string;
  statusCode: number;
  extensions: GraphQLErrorExtensions;
}

export const gqlFormatError = (
  err: GraphQLFormattedError,
  error: any,
): GraphqlReturnError => {
  console.log('Erreur: ', error);

  // Récupérer l'erreur originale depuis error directement
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const originalError = error?.originalError || error;

  // 1. Vérifier si c'est une erreur Zod
  if (originalError instanceof ZodError) {
    return {
      ok: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: originalError.message,
      extensions: {
        ...originalError.issues[0],
      },
    };
  }

  // 2. Vérifier si c'est une UnauthorizedException
  if (originalError instanceof UnauthorizedException) {
    return {
      ok: false,
      message: err.message || 'Non autorisé',
      statusCode: HttpStatus.UNAUTHORIZED,
      extensions: {
        code: 'UNAUTHORIZED',
      },
    };
  }

  // 3. Vérifier si c'est une HttpException (toutes les autres exceptions NestJS)
  if (originalError instanceof HttpException) {
    const status = originalError.getStatus();
    const response = originalError.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : (response as { message: string }).message || err.message;

    return {
      ok: false,
      message: message,
      statusCode: status,
      extensions: {
        code: 'HTTP_ERROR',
        ...(typeof response === 'object' ? response : {}),
      },
    };
  }
  const serviceName = err.extensions?.serviceName as
    'academic' | 'core' | 'auth' | 'operations';

  if (serviceName) {
    return {
      ok: false,
      message: err.message,
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      extensions: {
        serviceName,
        code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: err.path,
      },
    };
  }
  // 4. Erreur par défaut
  return {
    ok: false,
    message: err.message || 'Une erreur interne est survenue',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    extensions: {
      ...err.extensions,
    },
  };
};

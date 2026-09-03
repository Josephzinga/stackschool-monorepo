import { GraphQLErrorExtensions, GraphQLFormattedError } from 'graphql';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';
import type {
  AcademicErrorCode,
  AuthErrorCode,
  CoreErrorCode,
  OperationsErrorCode,
} from '@stackschool/messaging';

export type GatewayErrorCode =
  AcademicErrorCode | AuthErrorCode | CoreErrorCode | OperationsErrorCode;

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

  // 2. Vérifier si c'est une HttpException (toutes les autres exceptions NestJS)
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
  const serviceName = err.extensions?.serviceName;
  const errorCode = err.extensions?.code;

  if (serviceName && isGatewayErrorCode(errorCode)) {
    return {
      ok: false,
      message: err.message,
      statusCode: getHttpStatusCode(errorCode),
      extensions: {
        ...err.extensions,
        timeStamp: new Date().toISOString(),
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

export function getHttpStatusCode(code: GatewayErrorCode): number {
  switch (code) {
    case 'NOT_FOUND':
    case 'SCHOOL_NOT_FOUND':
    case 'SUBJECT_NOT_FOUND':
    case 'USER_NOT_FOUND':
    case 'MEMBERSHIP_NOT_FOUND':
    case 'STUDENT_NOT_FOUND':
    case 'TEACHER_NOT_FOUND':
    case 'STAFF_NOT_FOUND':
      return HttpStatus.NOT_FOUND;
    case 'FORBIDDEN':
      return HttpStatus.FORBIDDEN;
    case 'CONFLICT':
    case 'CLASS_ALREADY_EXISTS':
    case 'SUBJECT_ALREADY_EXIST':
    case 'MEMBERSHIP_ALREADY_EXIST':
    case 'STUDENT_ALREADY_EXIST':
    case 'EMAIL_TAKEN':
    case 'USERNAME_TAKEN':
    case 'PHONE_TAKEN':
      return HttpStatus.CONFLICT;
    case 'INVALID_CREDENTIALS':
      return HttpStatus.UNAUTHORIZED;
    case 'TOO_MANY_REQUEST':
      return HttpStatus.TOO_MANY_REQUESTS;
    case 'VALIDATION_ERROR':
    case 'BAD_REQUEST':
    case 'SOCIAL_ONLY_ACCOUNT':
    case 'SCHOOL_ID_NOT_FOUND':
      return HttpStatus.BAD_REQUEST;
    case 'AUTH_SERVICE_ERROR':
      return HttpStatus.BAD_GATEWAY;
    case 'INTERNAL_ERROR':
    case 'DB_ERROR':
      return HttpStatus.INTERNAL_SERVER_ERROR;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

function isGatewayErrorCode(code: unknown): code is GatewayErrorCode {
  return typeof code === 'string' && code in errorStatusCodes;
}

const errorStatusCodes: Record<GatewayErrorCode, true> = {
  INTERNAL_ERROR: true,
  VALIDATION_ERROR: true,
  SCHOOL_NOT_FOUND: true,
  SCHOOL_ID_NOT_FOUND: true,
  DB_ERROR: true,
  CLASS_ALREADY_EXISTS: true,
  CONFLICT: true,
  SUBJECT_ALREADY_EXIST: true,
  NOT_FOUND: true,
  FORBIDDEN: true,
  SUBJECT_NOT_FOUND: true,
  BAD_REQUEST: true,
  EMAIL_TAKEN: true,
  USERNAME_TAKEN: true,
  PHONE_TAKEN: true,
  USER_NOT_FOUND: true,
  INVALID_CREDENTIALS: true,
  SOCIAL_ONLY_ACCOUNT: true,
  TOO_MANY_REQUEST: true,
  MEMBERSHIP_ALREADY_EXIST: true,
  AUTH_SERVICE_ERROR: true,
  MEMBERSHIP_NOT_FOUND: true,
  STUDENT_NOT_FOUND: true,
  TEACHER_NOT_FOUND: true,
  STAFF_NOT_FOUND: true,
  STUDENT_ALREADY_EXIST: true,
};

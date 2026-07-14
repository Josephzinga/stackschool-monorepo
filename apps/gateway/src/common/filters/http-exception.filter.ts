import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() ?? 500;
    const exceptionResponse = exception.getResponse() as
      { errors?: unknown } | string | number | boolean | null;
    const errors =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'errors' in exceptionResponse
        ? exceptionResponse.errors
        : exceptionResponse;
    response.status(status).json({
      ok: false,
      errors,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

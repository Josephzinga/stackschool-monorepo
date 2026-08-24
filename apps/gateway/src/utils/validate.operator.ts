import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ZodError, ZodSchema } from 'zod';
import { InternalServerErrorException } from '@nestjs/common';

/**
 * Custom RxJS Operator for end-to-end type safety.
 * Validates the stream data using a Zod schema and cleanly routes errors.
 */
export function validateWith<T>(
  schema: ZodSchema<T>,
): OperatorFunction<any, T> {
  return (source$: Observable<any>) =>
    source$.pipe(
      map((data) => schema.parse(data)),

      catchError((err: ZodError | Error) => {
        if (err.name === 'ZodError') {
          return throwError(
            () =>
              new InternalServerErrorException(
                'Microservice response payload failed schema validation.',
                err,
              ),
          );
        }

        return throwError(() => err);
      }),
    );
}

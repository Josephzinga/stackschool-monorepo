import { createServiceError } from './api-errors';
import { ServiceError } from '@stackschool/shared';

describe('createServiceError', () => {
  it('devrait créer une ServiceError avec le message et le code de statut donnés', () => {
    const message = 'Test error';
    const statusCode = 400;
    const error = createServiceError(message, statusCode);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.details).toBeUndefined();
  });

  it('devrait utiliser le code de statut 500 par défaut', () => {
    const message = 'Default error';
    const error = createServiceError(message);

    expect(error.statusCode).toBe(500);
  });

  it('devrait inclure les détails si fournis', () => {
    const message = 'Detailed error';
    const details = { field: 'test' };
    const error = createServiceError(message, 422, details);

    expect(error.details).toEqual(details);
  });
});

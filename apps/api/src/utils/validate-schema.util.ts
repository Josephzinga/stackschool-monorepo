import { ZodSchema } from 'zod';

/**
 * Valide des données de manière sécurisée (sans lancer d'erreur).
 *
 * @template T
 * @param {ZodSchema<T>} schema
 * @param {unknown} data
 * @returns {SafeValidateSchemaResult<T>}
 */

interface SafeValidateSchemaResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export function safeValidateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): SafeValidateSchemaResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return { errors, success: false };
  }

  return { data: result.data, success: true };
}

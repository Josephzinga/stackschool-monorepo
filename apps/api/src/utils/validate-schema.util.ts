import { ZodSchema } from 'zod';

/**
 * Valide des données de manière sécurisée (sans lancer d'erreur).
 *
 * @template T
 * @param {ZodSchema<T>} schema
 * @param {unknown} data
 * @returns {Array<{field: string, message: string}> | undefined}
 * Retourne un tableau d'objets d'erreur si la validation échoue,
 * sinon retourne `undefined` si la validation réussit.
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: T,
): Array<{ field: string; message: string }> | undefined {
  const result = schema.safeParse(data);
  if (!result.success) {
    return result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }
}

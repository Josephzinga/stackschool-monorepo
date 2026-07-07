import { ZodType } from 'zod';

export interface SafeValidateSchemaResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export function safeValidateSchema<T>(
  schema: ZodType<T>,
  data: T,
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

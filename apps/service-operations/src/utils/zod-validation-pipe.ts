import { PipeTransform, Injectable } from '@nestjs/common';
import { ZodType } from 'zod';
import { AppRpcException, safeValidateSchema } from '@stackschool/shared';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const { success, errors, data } = safeValidateSchema(this.schema, value);

    if (!success) {
      throw new AppRpcException(
        'VALIDATION_ERROR',
        errors?.[0]?.message ?? 'Erreur de validation.',
      );
    }

    return data;
  }
}

import {Injectable, PipeTransform,} from '@nestjs/common';
import {ZodType} from 'zod';
import {safeValidateSchema} from './safe-validate-schema';
import {AuthRpcException} from '../errors/auth-rcp.error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const { success, errors, data } = safeValidateSchema(this.schema, value);
   const meta = {
     field: errors?.[0].field
  }
    if (!success) {
      throw new AuthRpcException(
          'VALIDATION_ERROR',
        errors?.[0]?.message ?? 'Erreur de validation',
          meta
      );
    }

    return data;
  }
}

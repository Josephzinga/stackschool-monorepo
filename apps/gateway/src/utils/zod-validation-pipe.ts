import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestException({
        ok: false,
        errors,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result.data;
  }
}

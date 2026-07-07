import { CreateSchoolInput } from './create-school.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSchoolInput extends PartialType(CreateSchoolInput) {
  id: number;
}

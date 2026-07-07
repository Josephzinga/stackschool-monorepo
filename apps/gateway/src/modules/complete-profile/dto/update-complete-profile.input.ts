import { CreateCompleteProfileInput } from './create-complete-profile.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCompleteProfileInput extends PartialType(CreateCompleteProfileInput) {
  id: number;
}

import { Injectable } from '@nestjs/common';
import { CreateCompleteProfileInput } from './dto/create-complete-profile.input';
import { UpdateCompleteProfileInput } from './dto/update-complete-profile.input';

@Injectable()
export class CompleteProfileService {
  create(createCompleteProfileInput: CreateCompleteProfileInput) {
    return 'This action adds a new completeProfile';
  }

  findAll() {
    return `This action returns all completeProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} completeProfile`;
  }

  update(id: number, updateCompleteProfileInput: UpdateCompleteProfileInput) {
    return `This action updates a #${id} completeProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} completeProfile`;
  }
}

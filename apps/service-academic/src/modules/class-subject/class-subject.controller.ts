import { Controller } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ACADEMIC_PATTERNS,
  ClassSubjectContract,
  FindClassSubjectInput,
} from '@stackschool/messaging';

@Controller()
export class ClassSubjectController {
  constructor(private readonly service: ClassSubjectService) {}

  @MessagePattern(ACADEMIC_PATTERNS.FIND_CLASS_SUBJECT)
  async findOne(
    @Payload() dto: FindClassSubjectInput,
  ): Promise<ClassSubjectContract | null> {
    return this.service.findOne(dto);
  }
}

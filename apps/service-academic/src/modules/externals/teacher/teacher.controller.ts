import { Controller } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ACADEMIC_PATTERNS,
  FindTeacherIdsByClassOrSubject,
  ZodValidationPipe,
} from '@stackschool/messaging';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @MessagePattern(ACADEMIC_PATTERNS.FIND_TEACHER_IDS_BY_CLASS_SUBJECT)
  async findIdsByClassOrSubject(
    @Payload(new ZodValidationPipe(FindTeacherIdsByClassOrSubject))
    dto: FindTeacherIdsByClassOrSubject,
  ) {
    if (!dto.classId && !dto.subjectId) {
      return;
    }
    return this.teacherService.findIdsByClassOrSubject(dto);
  }
}

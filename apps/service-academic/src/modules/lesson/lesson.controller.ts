import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACADEMIC_PATTERNS, RawLessonEvent } from '@stackschool/messaging';
import { LessonService } from './lesson.service';

@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @MessagePattern(ACADEMIC_PATTERNS.FIND_LESSONS_BY_TEACHER_IDS)
  async findByTeacherIds(@Payload() dto: any): Promise<RawLessonEvent[]> {
    return this.lessonService.findLessonsByTeacherIds(dto);
  }

  @MessagePattern(ACADEMIC_PATTERNS.GET_LESSONS_BY_CLASS_RESOURCE)
  async getLessonsByClassResource(
    @Payload() dto: GetLessonsInput & { schoolId: string },
  ) {
    return this.lessonService.getLessonsByClassResource(dto, dto.schoolId);
  }
}

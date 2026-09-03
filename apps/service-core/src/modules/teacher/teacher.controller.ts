import { Controller } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CORE_PATTERNS,
  FindTeachersPaginatedInput,
  FindTeachersPaginatedResponse,
} from '@stackschool/messaging';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @MessagePattern(CORE_PATTERNS.TEACHER.FIND_PAGINATED)
  async findTeachersPaginated(
    @Payload() input: FindTeachersPaginatedInput,
  ): Promise<FindTeachersPaginatedResponse> {
    return this.teacherService.findTeachersPaginated(input);
  }
}

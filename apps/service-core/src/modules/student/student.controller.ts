import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentService } from './student.service';
import { CORE_PATTERNS, StudentContract } from '@stackschool/messaging';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern(CORE_PATTERNS.STUDENT.FIND_ONE)
  async getOne(
    @Payload() dto: { id: string; schoolId: string },
  ): Promise<StudentContract | null> {
    return this.studentService.findOne({ id: dto.id, schoolId: dto.schoolId });
  }
}

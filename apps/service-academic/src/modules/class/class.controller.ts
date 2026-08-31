import { Controller } from '@nestjs/common';
import { ClassService } from './class.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACADEMIC_PATTERNS } from '@stackschool/messaging';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @MessagePattern(ACADEMIC_PATTERNS.FIND_ONE_CLASS)
  async getClass(@Payload() dto: { id: string; schoolId?: string }) {
    return this.classService.findOne(dto.id, dto.schoolId);
  }
}

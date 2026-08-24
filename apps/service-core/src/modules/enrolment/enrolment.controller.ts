import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CORE_PATTERNS,
  HandleRoleDataInput,
  HandleSchoolDataInput,
} from '@stackschool/messaging';
import { EnrolmentService } from './enrolment.service';

@Controller()
export class EnrolmentController {
  constructor(private readonly enrolmentService: EnrolmentService) {}

  @MessagePattern(CORE_PATTERNS.COMPLETE_PROFILE.HANDLE_SCHOOL_DATA)
  async handleSchoolData(@Payload() data: HandleSchoolDataInput) {
    console.log('handleSchoolData: ', data);
    return await this.enrolmentService.handleSchoolData(data);
  }

  @MessagePattern(CORE_PATTERNS.COMPLETE_PROFILE.HANDLE_ROLE_DATA)
  async handleRoleData(
    @Payload()
    data: HandleRoleDataInput,
  ) {
    console.log('HandlerRoleData: ', data);
    return await this.enrolmentService.handleRoleData(data);
  }
}

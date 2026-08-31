import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_EVENTS,
  AUTH_PATTERNS,
  ValidateUserFieldInput,
  ValidateUserFieldResponse,
  ZodValidationPipe,
} from '@stackschool/messaging';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(AUTH_EVENTS.DISABLE_USERS_BY_IDS)
  async disableByIds(@Payload('userIds') userIds: string[]) {
    return this.userService.disableByIds(userIds);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER_FIELD)
  async rpcValidateUserField(
    @Payload(new ZodValidationPipe(ValidateUserFieldInput))
    data: ValidateUserFieldInput,
  ): Promise<ValidateUserFieldResponse> {
    return this.userService.validateField(data);
  }
}

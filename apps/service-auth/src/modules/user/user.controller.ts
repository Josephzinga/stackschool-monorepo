import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_EVENTS,
  AUTH_PATTERNS,
  FindUserByIdentifiers,
  UpdateUserInput,
  UserContract,
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

  @MessagePattern(AUTH_PATTERNS.UPDATE_USER)
  async update(
    @Payload(new ZodValidationPipe(UpdateUserInput)) dto: UpdateUserInput,
  ): Promise<UserContract> {
    return this.userService.update(dto.id, {
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: dto.password,
      isActive: dto.isActive,
      hasMembership: dto.hasMembership,
      profileCompleted: dto.profileCompleted,
    });
  }

  @MessagePattern(AUTH_PATTERNS.FIND_USER_BY_ID)
  async findById(@Payload('id') id: string): Promise<UserContract | null> {
    return this.userService.findOne({
      where: { id: id },
    });
  }

  @MessagePattern(AUTH_PATTERNS.FIND_USER_BY_IDENTIFIERS)
  async findByIdentifier(
    @Payload(new ZodValidationPipe(FindUserByIdentifiers))
    dto: FindUserByIdentifiers,
  ): Promise<UserContract | null> {
    return this.userService.findByIdentifiers(dto);
  }
}

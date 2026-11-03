import { Controller } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CORE_PATTERNS,
  FindBySchoolIdAndUserIdInput,
  FindManyByUserIdInput,
  FindManyMemberInput,
  FindManyMemberResponse,
  SchoolUserContract,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_MANY)
  async rpcFindManyMember(
    @Payload(new ZodValidationPipe(FindManyMemberInput))
    dto: FindManyMemberInput,
  ): Promise<FindManyMemberResponse> {
    return this.membershipService.findMany(dto);
  }

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_ONE)
  async rpcFindOne(@Payload() data: { id: string }) {
    return this.membershipService.findOne(data.id);
  }

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_BY_SCHOOL_ID_AND_USER_ID)
  async rpcFindBySchoolAndUserId(
    @Payload(new ZodValidationPipe(FindBySchoolIdAndUserIdInput))
    data: FindBySchoolIdAndUserIdInput,
  ): Promise<SchoolUserContract | null> {
    const schoolUser = await this.membershipService.findFull({
      schoolId_userId: {
        schoolId: data.schoolId,
        userId: data.userId,
      },
    });
    return schoolUser || null;
  }

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_MANY_BY_USER_ID)
  async rpcFindManyByUserId(
    @Payload(new ZodValidationPipe(FindManyByUserIdInput))
    data: FindManyByUserIdInput,
  ) {
    console.log('FindByUserId: ', data);
    const members = await this.membershipService.findManyByUserId(data.userIds);
    return {
      members,
    };
  }
}

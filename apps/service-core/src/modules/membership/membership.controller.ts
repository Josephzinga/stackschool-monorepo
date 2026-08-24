import { Controller } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CORE_PATTERNS,
  FindBySchoolIdAndUserIdInput,
  FindManyByUserIdInput,
  FindManyMemberInput,
  SchoolUserContract,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly prisma: PrismaService,
  ) {}

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_MANY)
  async rpcFindManyMember(
    @Payload(new ZodValidationPipe(FindManyMemberInput))
    data: FindManyMemberInput,
  ) {
    const ids = data.ids;
    return this.membershipService.findMany(ids);
  }

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_ONE)
  async rpcFindOne(@Payload() data: { id: string }) {
    return this.membershipService.findOne(data.id);
  }

  @MessagePattern(CORE_PATTERNS.MEMBERSHIP.FIND_BY_SCHOOL_ID_AND_USER_ID)
  async rpcFindBySchoolAndUserId(
    @Payload(new ZodValidationPipe(FindBySchoolIdAndUserIdInput))
    data: FindBySchoolIdAndUserIdInput,
  ): Promise<Omit<
    SchoolUserContract,
    'parent' | 'staff' | 'teacher' | 'school' | 'student'
  > | null> {
    const schoolUser = await this.membershipService.findUnique({
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
    const members = await this.membershipService.findManyByUserId(data.userIds);
    return {
      members,
    };
  }
}

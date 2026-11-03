import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord, MarkAttendanceInput } from '../../graphql';
import {
  type GraphQLContext,
  RequireAbility,
  Roles,
} from '@stackschool/messaging';

@Resolver('AttendanceRecord')
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @RequireAbility(
    ['MANAGE', 'ATTENDANCE_RECORD'],
    ['MARK', 'ATTENDANCE_RECORD'],
  )
  @Mutation('markAttendance')
  async mark(
    @Context() ctx: GraphQLContext,
    @Args('input') dto: MarkAttendanceInput[],
  ): Promise<AttendanceRecord> {
    return this.attendanceService.mark(dto, ctx.schoolUser!, ctx.schoolId!);
  }
}

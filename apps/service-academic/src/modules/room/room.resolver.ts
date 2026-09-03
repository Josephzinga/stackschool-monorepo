import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import {
  ApiResponse,
  CreateRoomInput,
  GetSchoolRoomInput,
  Room,
  RoomList,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import {
  CreateRoomSchema,
  Roles,
  SchoolAccessGuard,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { RolesGuard } from '../../common/guards/role.guard';

@Resolver('Room')
@UseGuards(SchoolAccessGuard, RolesGuard)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'STAFF')
  @Query('getSchoolRooms')
  async getSchool(
    @Args('filter') dto: GetSchoolRoomInput,
    @Context('schoolId') schoolId: string,
  ): Promise<RoomList> {
    return this.roomService.getSchool(dto, schoolId);
  }

  @Roles('ADMIN')
  @Mutation('createRoom')
  async create(
    @Args('input', new ZodValidationPipe(CreateRoomSchema))
    dto: CreateRoomInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Room> {
    return this.roomService.create(dto, schoolId);
  }

  @Roles('ADMIN')
  @Mutation('deleteRooms')
  async delete(
    @Args() dto: { soft: boolean; ids: string | string[] },
    @Context('schoolId') schoolId: string,
  ): Promise<ApiResponse> {
    return this.roomService.deleteMany(dto, schoolId);
  }
}

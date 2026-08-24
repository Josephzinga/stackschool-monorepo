import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TeacherService } from './teacher.service';
import {
  CreateTeacherInput,
  GetSchoolTeachersInput,
  SchoolProfile,
  Teacher,
  TeacherList,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { RequiredRoles } from '../../common/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role.guard';
import * as dataloaderService from '../dataloader/dataloader.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';

@Resolver('Teacher')
export class TeacherResolver {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly prisma: PrismaService,
  ) {}

  @RequiredRoles('TEACHER', 'STAFF', 'ADMIN')
  @UseGuards(RolesGuard)
  @Query('getSchoolTeachers')
  async getSchoolTeachers(
    @Args('input') input: GetSchoolTeachersInput,
    @Context('schoolId') schoolId: string,
  ): Promise<TeacherList> {
    const teachers = await this.teacherService.getMany(input, schoolId);
    return teachers;
  }

  @RequiredRoles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('createTeacher')
  async createTeacher(
    @Args('input') data: CreateTeacherInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Teacher> {
    return await this.teacherService.create(data, schoolId);
  }

  @ResolveField('schoolProfile')
  async resolveSchoolProfile(
    @Parent() parent: Teacher,
    @Loaders() loaders: dataloaderService.DataLoaders,
  ): Promise<SchoolProfile | null> {
    if (!parent.schoolUserId) return null;
    const schoolProfile = await loaders.schoolProfileLoader.load(
      parent.schoolUserId,
    );

    return schoolProfile ?? null;
  }
}

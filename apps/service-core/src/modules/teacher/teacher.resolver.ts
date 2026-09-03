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
  SchoolMembership,
  SchoolProfile,
  Teacher,
  TeacherList,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role.guard';
import * as dataloaderService from '../dataloader/dataloader.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import {
  CreateTeacherSchema,
  Roles,
  ZodValidationPipe,
} from '@stackschool/messaging';
import z from 'zod';

@Resolver('Teacher')
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Roles('TEACHER', 'STAFF', 'ADMIN')
  @UseGuards(RolesGuard)
  @Query('getSchoolTeachers')
  async getSchoolTeachers(
    @Args('input') input: GetSchoolTeachersInput,
    @Context('schoolId') schoolId: string,
  ): Promise<TeacherList> {
    const teachers = await this.teacherService.getSchool(input, schoolId);
    return teachers;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('createTeacher')
  async createTeacher(
    @Args('input', new ZodValidationPipe(CreateTeacherSchema))
    data: CreateTeacherInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Teacher> {
    return await this.teacherService.create(data, schoolId);
  }

  @Query('teacher')
  @Roles('ADMIN', 'STAFF', 'TEACHER')
  @UseGuards(RolesGuard)
  async getOne(
    @Context('schoolId') schoolId: string,
    @Args('id', new ZodValidationPipe(z.string())) id: string,
  ): Promise<Teacher> {
    return this.teacherService.findOne(id, schoolId);
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

  @ResolveField('schoolUser')
  async getSchoolUser(
    @Parent() teacher: Teacher,
    @Loaders() loaders: dataloaderService.DataLoaders,
  ): Promise<SchoolMembership | null> {
    if (!teacher.schoolUserId) return null;
    const member = await loaders.schoolUserLoader.load(teacher.schoolUserId);
    return member ?? null;
  }
}

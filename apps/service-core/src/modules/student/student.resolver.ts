import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StudentService } from './student.service';
import {
  CreateStudentInput,
  GetSchoolStudentsInput,
  ParentStudent,
  SchoolProfile,
  Student,
  StudentList,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role.guard';
import { RequiredRoles } from '../../common/decorators/role.decorator';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('Student')
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @RequiredRoles('ADMIN', 'TEACHER', 'STAFF')
  @UseGuards(RolesGuard)
  @Query('getSchoolStudents')
  async getSchoolStudent(
    @Args('input') input: GetSchoolStudentsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<StudentList> {
    return this.studentService.findAll(input, schoolId);
  }

  @RequiredRoles('ADMIN', 'STAFF')
  @UseGuards(RolesGuard)
  @Mutation('createStudent')
  async create(
    @Args('input') input: CreateStudentInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Student> {
    return this.studentService.create(input, schoolId);
  }

  @Mutation('deleteStudents')
  async deleteMany(
    @Args() args: { studentIds: string[]; soft: boolean },
    @Context('schoolId') schoolId: string,
  ): Promise<void> {
    return this.studentService.deleteMany(args.studentIds, args.soft, schoolId);
  }

  @ResolveField('schoolProfile')
  async getSchoolProfile(
    @Parent() student: Student,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolProfile | null> {
    if (!student.schoolUserId) return null;
    return (
      (await loaders.schoolProfileLoader.load(student.schoolUserId)) || null
    );
  }

  @ResolveField('parentStudent')
  async getParentStudent(
    @Parent() student: Student,
  ): Promise<ParentStudent | null> {
    return null;
  }
}

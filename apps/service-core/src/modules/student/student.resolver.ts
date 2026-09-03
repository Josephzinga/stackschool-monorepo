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
  ApiResponse,
  CreateStudentInput,
  GetSchoolStudentsInput,
  ParentStudent,
  SchoolProfile,
  Student,
  StudentList,
  StudentSearchInput,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role.guard';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import {
  CoreRpcException,
  Roles,
  SchoolAccessGuard,
} from '@stackschool/messaging';

@Resolver('Student')
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @UseGuards(SchoolAccessGuard, RolesGuard)
  @Query('getSchoolStudents')
  async getSchoolStudent(
    @Args('input') input: GetSchoolStudentsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<StudentList> {
    return this.studentService.findAll(input, schoolId);
  }

  @Roles('ADMIN', 'STAFF')
  @UseGuards(SchoolAccessGuard, RolesGuard)
  @Mutation('createStudent')
  async create(
    @Args('input') input: CreateStudentInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Student> {
    return this.studentService.create(input, schoolId);
  }

  @Roles('ADMIN')
  @UseGuards(SchoolAccessGuard, RolesGuard)
  @Mutation('deleteStudents')
  async deleteMany(
    @Args() args: { studentIds: string[]; soft: boolean },
    @Context('schoolId') schoolId: string,
  ): Promise<ApiResponse> {
    return this.studentService.deleteMany(args.studentIds, args.soft, schoolId);
  }
  @Query('searchStudent')
  async searchStudent(
    @Args('filter') dto: StudentSearchInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Student[]> {
    if (!schoolId && !dto.schoolId)
      throw new CoreRpcException(
        'BAD_REQUEST',
        "L'identifiant de l'établissement manquant",
      );
    if (dto.searchTerm && dto.searchTerm.length <= 1) return [];
    return this.studentService.search(dto, dto.schoolId || schoolId);
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

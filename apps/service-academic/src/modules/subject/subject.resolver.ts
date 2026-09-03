import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SubjectService } from './subject.service';
import {
  ClassSubject,
  CreateSubjectInput,
  DeleteSubjectsInput,
  GetSubjectInput,
  Subject,
  SubjectList,
} from '../../graphql';
import {
  createSubjectForm,
  CreateSubjectForm,
  Roles,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { dot } from 'node:test/reporters';
import { UseGuards } from '@nestjs/common';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { RolesGuard } from '../../common/guards/role.guard';

@Resolver('Subject')
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'STAFF')
  @UseGuards(RolesGuard)
  @Query('getSchoolSubjects')
  async GetSchoolSubjects(
    @Context('schoolId') schoolId: string,
    @Args('input') dto: GetSubjectInput,
  ): Promise<SubjectList> {
    return this.subjectService.getAll(dto, schoolId);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('createSubject')
  async create(
    @Args('input', new ZodValidationPipe(createSubjectForm))
    dto: CreateSubjectInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Subject> {
    return this.subjectService.create(dto, schoolId);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('deleteSubjects')
  async deleteMany(
    @Args('input') dto: DeleteSubjectsInput,
    @Context('schoolId') schoolId: string,
  ) {
    return this.subjectService.deleteMany(dto, schoolId);
  }

  @ResolveField('classSubjects')
  async getClassSubject(
    @Parent() subject: Subject,
    @Loaders() loaders: DataLoaders,
  ): Promise<ClassSubject[]> {
    return loaders.classSubjectBySubjectLoader.load(subject.id);
  }
}

import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParentStudentService } from './parent-student.service';
import {
  CreateParentStudentInput,
  ParentStudent,
  Student,
} from '../../graphql';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import { UseGuards } from '@nestjs/common';
import {
  ParentStudentSchema,
  Roles,
  RolesGuard,
  SchoolAccessGuard,
  ZodValidationPipe,
} from '@stackschool/messaging';
import z from 'zod';

@Resolver('ParentStudent')
@UseGuards(SchoolAccessGuard, RolesGuard)
export class ParentStudentResolver {
  constructor(private readonly parentStudentService: ParentStudentService) {}

  @Roles('ADMIN')
  @Mutation('createParentStudent')
  async create(
    @Args(
      'input',
      new ZodValidationPipe(
        z.array(
          ParentStudentSchema.safeExtend({
            parentId: z.string(),
            studentId: z.string(),
          }),
        ),
      ),
    )
    dto: CreateParentStudentInput[],
    @Context('schoolId') schoolId: string,
  ): Promise<ParentStudent> {
    console.log('Input', dto);
    return this.parentStudentService.create(dto, schoolId);
  }

  @ResolveField('student')
  async getStudent(
    @Parent() parent: ParentStudent,
    @Loaders() loaders: DataLoaders,
  ): Promise<Student | null> {
    return (await loaders.studentLoader.load(parent.studentId)) || null;
  }

  @ResolveField('parent')
  async getParent(
    @Parent() root: ParentStudent,
    @Loaders() loaders: DataLoaders,
  ) {
    return loaders.parentLoader.load(root.parentId);
  }
}

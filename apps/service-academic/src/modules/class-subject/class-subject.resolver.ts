import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ClassSubjectService } from './class-subject.service';
import {
  ClassSubject,
  GetClassSubjectsInput,
  Group,
  GroupType,
  Subject,
  SubjectCategory,
  TeacherAssignment,
} from '../../graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { AcademicRpcException } from '@stackschool/messaging';

@Resolver('ClassSubject')
export class ClassSubjectResolver {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Query('getClassSubjects')
  async getMany(
    @Args('input') dto: GetClassSubjectsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<ClassSubject[]> {
    if (Object.values(dto).length === 0) {
      throw new AcademicRpcException(
        'BAD_REQUEST',
        'Au moins un input est requis.',
      );
    }
    return this.classSubjectService.findAll(dto, schoolId);
  }

  @ResolveField('subject')
  async getSubject(
    @Parent() parent: ClassSubject,
    @Loaders() loaders: DataLoaders,
  ): Promise<Subject | null> {
    const subject =
      (await loaders.subjectLoader.load(parent.subjectId)) || null;
    return {
      ...subject,
      id: subject?.id!,
      name: subject?.name ?? '',
      category: subject?.category as SubjectCategory,
      code: subject?.code!,
    };
  }

  @ResolveField('group')
  async getClass(
    @Parent() parent: ClassSubject,
    @Loaders() loaders: DataLoaders,
  ): Promise<Group | null> {
    const group = (await loaders.groupLoader.load(parent.groupId)) || null;
    return {
      ...group,
      id: group?.id!,
      name: group?.name!,
      type: group?.type as GroupType,
    };
  }

  @ResolveField('assignment')
  async getAssignment(
    @Parent() parent: ClassSubject,
    @Loaders() loaders: DataLoaders,
  ): Promise<TeacherAssignment | null> {
    const assignment = await loaders.assignmentsByClassSubjectLoader.load(
      parent.id,
    );
    return assignment || null;
  }
}

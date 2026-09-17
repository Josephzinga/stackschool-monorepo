import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson, LessonTeacher } from '../../../graphql';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';

@Resolver('Lesson')
export class LessonResolver {
  @ResolveField('teacher')
  async getTeacher(
    @Parent() parent: Lesson,
    @Loaders() loaders: DataLoaders,
  ): Promise<LessonTeacher | null> {
    console.log('Lesson.Teacher', parent);
    if (!parent.teacherId) return null;
    const teacher =
      (await loaders.teacherLessonLoader.load(parent.teacherId)) || null;
    console.log('Teacher', teacher);
    return teacher;
  }
}

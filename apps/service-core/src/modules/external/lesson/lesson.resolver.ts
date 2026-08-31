import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LessonService } from './lesson.service';

@Resolver()
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}
}

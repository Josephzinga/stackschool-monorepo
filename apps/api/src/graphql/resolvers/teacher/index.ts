import { teacherResolver } from './teacher.resolver';
import { teacherMutationResolver } from './teacher-mutation.resolver';
import { teacherQueryResolver } from './teacher-query.resolver';

export const teacherResolvers = {
  ...teacherResolver,
  ...teacherMutationResolver,
  ...teacherQueryResolver,
};
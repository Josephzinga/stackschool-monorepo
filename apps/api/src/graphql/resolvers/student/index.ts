import { studentMutationResolver } from './student-mutation.resolver';
import { studentQueryResolver } from './student-query.resolver';
import { studentResolver } from './student.resolver';

export const studentResolvers = {
  ...studentMutationResolver,
  ...studentResolver,
  ...studentQueryResolver,
};

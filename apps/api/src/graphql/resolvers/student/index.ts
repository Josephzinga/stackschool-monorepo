import { studentQueryResolver } from './query/student-query.resolver';
import { studentResolver } from './query/student.resolver';
import { createStudentMutationResolver } from './mutation/create-student.resolver';
import { deleteStudentMutationResolver } from './mutation/student-mutation.resolver';
import { updateStudentMutationResolver } from './mutation/update-student.resolver';

export const studentResolvers = {
  ...deleteStudentMutationResolver,
  ...studentResolver,
  ...studentQueryResolver,
  ...createStudentMutationResolver,
  ...updateStudentMutationResolver,
};

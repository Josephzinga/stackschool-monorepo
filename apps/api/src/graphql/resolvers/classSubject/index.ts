import { classSubjectMutationResolver } from './classSubject-mutation.resolver';
import { classSubjectResolver } from './classSubject.resolver';

export const classSubjectResolvers = {
  ...classSubjectMutationResolver,
  ...classSubjectResolver,
};
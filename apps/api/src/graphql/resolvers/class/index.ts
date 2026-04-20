import { classResolver } from './class.resolver';
import { classMutationResolver } from './class-mutation.resolver';
import { classQueryResolver } from './class-query.resolver';

export const classResolvers = {
  ...classResolver,
  ...classMutationResolver,
  ...classQueryResolver,
};
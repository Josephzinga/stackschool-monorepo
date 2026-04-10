import { UserInMe } from '@stackschool/shared';
import { DataLoaders } from '../graphql/resolvers/data-loader';
import { SchoolUser } from '@stackschool/db';

export interface Context {
  user?: UserInMe;
  loaders: DataLoaders;
  schoolId: string | null;
  membership: SchoolUser | null | undefined;
}

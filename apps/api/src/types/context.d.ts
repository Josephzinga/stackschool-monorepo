import type { Request } from 'express';
import { HasPermission, UserInMe } from '@stackschool/shared';
import { DataLoaders } from '../graphql/resolvers/data-loader';
import { PrismaClient, SchoolUser } from '@stackschool/db';
import { CheckRole } from '../lib/verify-role';

export interface Context {
  user?: UserInMe;
  req?: Request;
  loaders: DataLoaders;
  schoolId: string | null;
  prisma: PrismaClient;
  membership?: SchoolUser | null;
  hasPermission: HasPermission;
  checkRole: CheckRole;
}

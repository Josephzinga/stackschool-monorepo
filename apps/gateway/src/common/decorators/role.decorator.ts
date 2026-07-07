import { SetMetadata } from '@nestjs/common';
import { SchoolRole } from '../../graphql/graphql';

export const ROLES_KEY = 'roles';
export const PermissionsRule = (...roles: SchoolRole[]) =>
  SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';
import { SchoolRole } from '@stackschool/messaging';

export const SCHOOL_ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: SchoolRole[]) =>
  SetMetadata(SCHOOL_ROLES_KEY, roles);

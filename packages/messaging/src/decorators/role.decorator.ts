import {SetMetadata} from '@nestjs/common';
import {SchoolRole} from '@stackschool/contracts';

export const SCHOOL_ROLES_KEY = 'roles';
export const Roles = (...roles: SchoolRole[]) =>
  SetMetadata(SCHOOL_ROLES_KEY, roles);

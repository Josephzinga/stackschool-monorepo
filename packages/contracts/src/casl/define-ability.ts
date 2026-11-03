import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '../types/casl';
import {
  CaslPermissionSubject,
  toCaslAction,
  toCaslSubject,
} from './actions-subjects';
import { PermissionAction, PermissionSubject, SchoolRole } from '../core';

export interface GrantedPermission {
  action: PermissionAction;
  subject: PermissionSubject;
  conditions?: Record<string, unknown> | null;
}

export interface SchoolUserForAbility {
  id: string;
  schoolId: string;
  role: SchoolRole;
  grantedPermissions: GrantedPermission[];
  isOwner: boolean;
  assignedClassIds?: string[];
}

export function defineAbilityFor(schoolUser: SchoolUserForAbility): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(AppAbility);

  for (const grant of schoolUser.grantedPermissions) {
    can(
      toCaslAction(grant.action),
      toCaslSubject<CaslPermissionSubject>(grant.subject),
      grant.conditions ?? undefined,
    );
  }

  if (schoolUser.role === 'TEACHER' && schoolUser.assignedClassIds?.length) {
    can('update', 'Grade', { classId: { $in: schoolUser.assignedClassIds } });
  }

  return build({
    detectSubjectType: (obj: any) =>
      obj.__caslSubjectType__ ?? obj.constructor.name,
  });
}

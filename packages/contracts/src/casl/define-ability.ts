// This is the ONE function that turns "what a SchoolUser is allowed to do"
// into a CASL ability. Every service (NestJS guards) and the frontend
// (AbilityProvider) import this instead of re-implementing the logic.

import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '../types/casl';
import { toCaslAction, toCaslSubject } from './actions-subjects';
import { PermissionAction, PermissionSubject } from '../core';

// One row = one SchoolUserPermission joined with its Permission.
// `conditions` is the JSON column on SchoolUserPermission — a fixed scoping
// rule attached to this specific grant (e.g. "only the primary section"),
// NOT a place to interpolate the current request's values.
export interface GrantedPermission {
  action: PermissionAction; // Prisma PermissionAction value, e.g. "UPDATE"
  subject: PermissionSubject; // Prisma PermissionSubject value, e.g. "GRADE"
  conditions?: Record<string, unknown> | null;
}

// Whatever you resolve once per request (from session cache, JWT claims, or
// a DB read) and pass in here. Keep it minimal — this is what both NestJS
// guards and the frontend provider will construct.
export interface SchoolUserForAbility {
  id: string;
  schoolId: string;
  role: string;
  grantedPermissions: GrantedPermission[];
  // Anything resolved dynamically at request time (not stored as JSON)
  // that a role-based rule below needs, e.g. the teacher's own classes.
  assignedClassIds?: string[];
}

export function defineAbilityFor(schoolUser: SchoolUserForAbility): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(AppAbility);

  // 1. Explicit grants from SchoolUserPermission — the configurable part,
  //    editable by an admin through the permissions UI.
  for (const grant of schoolUser.grantedPermissions) {
    can(
      toCaslAction(grant.action),
      toCaslSubject(grant.subject),
      grant.conditions ?? undefined,
    );
  }

  // 2. Rules derived from role + request-time data, not persisted as JSON.
  //    Add these here as they come up — this is where "a teacher can only
  //    grade their own classes" lives, computed fresh every request.
  if (schoolUser.role === 'TEACHER' && schoolUser.assignedClassIds?.length) {
    can('update', 'Grade', { classId: { $in: schoolUser.assignedClassIds } });
  }

  return build({
    // Lets CASL infer the subject type from a plain object at runtime
    // (e.g. checking ability.can('update', someGradeInstance)) by looking
    // for a __caslSubjectType__ marker, falling back to the constructor name.
    detectSubjectType: (obj: any) =>
      obj.__caslSubjectType__ ?? obj.constructor.name,
  }) 
}

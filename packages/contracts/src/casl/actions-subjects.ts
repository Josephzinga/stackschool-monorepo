// These mirror PermissionAction / PermissionSubject in your Prisma schemas.
// Kept as plain string unions here (not imported from @prisma/client) because
// packages/contracts is consumed by services with isolated Postgres instances —
// only service-auth has the Prisma client that generates these enums.
// Update this file by hand whenever you add a value to the Prisma enums.

import {
  PermissionAction,
  PermissionSubject,
  SchoolUserContract,
} from '../core';
import { SchoolUserForAbility } from './define-ability.ts';

export type CaslPermissionAction =
  | 'manage' // CASL wildcard: all actions on the subject
  | 'create'
  | 'read'
  | 'update'
  | 'confirm'
  | 'delete'
  | 'mark' // e.g. attendance
  | 'publish' // e.g. bulletins
  | 'export'; // e.g. financial reports

export type CaslPermissionSubject =
  | 'Student'
  | 'Teacher'
  | 'Parent'
  | 'Staff'
  | 'Enrollment'
  | 'Class'
  | 'Subject'
  | 'Lesson'
  | 'Grade'
  | 'Bulletin'
  | 'Timetable'
  | 'Exam'
  | 'AttendanceRecord'
  | 'Payment'
  | 'Payroll'
  | 'FinancialReport'
  | 'SchoolSettings'
  | 'SchoolUserPermission'
  | 'all'; // CASL wildcard subject

// Prisma stores enum values as UPPER_SNAKE_CASE (e.g. "ATTENDANCE_RECORD").
// CASL subjects are conventionally PascalCase matching the domain concept
// (e.g. "AttendanceRecord"). These two converters are the single place that
// bridges the two conventions, so nothing else needs to know about casing.

export function toCaslAction(
  prismaAction: PermissionAction,
): CaslPermissionAction {
  return prismaAction.toLowerCase() as CaslPermissionAction;
}

export function toCaslSubject<T>(
  prismaSubject: PermissionSubject,
): T | CaslPermissionSubject {
  return prismaSubject
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('') as T | CaslPermissionSubject;
}

export function toSchoolUserAbility(
  schoolUser: SchoolUserContract,
): SchoolUserForAbility {
  return {
    ...schoolUser,
    schoolId: schoolUser.schoolId!,
    grantedPermissions: schoolUser.permissions ?? [],
  };
}

import { z } from 'zod';

// ==========================================
// 1. PermissionAction
// ==========================================
export const PermissionAction = z.enum([
  'MANAGE',
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'MARK',
  'PUBLISH',
  'EXPORT',
  'CONFIRM',
]);
export type PermissionAction = z.infer<typeof PermissionAction>;

// ==========================================
// 2. PermissionSubject
// ==========================================
export const PermissionSubject = z.enum([
  'STUDENT',
  'TEACHER',
  'PARENT',
  'STAFF',
  'CLASS',
  'SUBJECT',
  'GRADE',
  'LESSON',
  'ENROLLMENT',
  'BULLETIN',
  'TIMETABLE',
  'EXAM',
  'ATTENDANCE_RECORD',
  'PAYMENT',
  'PAYROLL',
  'FINANCIAL_REPORT',
  'SCHOOL_SETTINGS',
  'SCHOOL_USER_PERMISSION',
  'ALL',
]);
export type PermissionSubject = z.infer<typeof PermissionSubject>;

// ==========================================
// 3. PermissionModule
// ==========================================
export const PermissionModule = z.enum([
  'ATTENDANCE',
  'ACADEMICS',
  'USERS',
  'FINANCE',
  'SETTINGS',
  'ENROLLMENT',
]);
export type PermissionModule = z.infer<typeof PermissionModule>;

export const DisciplinaryType = z.enum(['SUSPENSION', 'EXPULSION', 'WARNING']);
export type DisciplinaryType = z.infer<typeof DisciplinaryType>;

export const SchoolRole = z.enum([
  'ADMIN',
  'TEACHER',
  'STUDENT',
  'PARENT',
  'STAFF',
]);
export type SchoolRole = z.infer<typeof SchoolRole>;

export const GlobalRole = z.enum(['SUPER_ADMIN', 'USER']);
export type GlobalRole = z.infer<typeof GlobalRole>;

export const RelationType = z.enum([
  'FATHER',
  'MOTHER',
  'GUARDIAN',
  'UNCLE',
  'OTHER',
  'GRAND_MOTHER',
  'GRAND_FATHER',
  'AUNT',
]);
export type RelationType = z.infer<typeof RelationType>;

export const ContactPreference = z.enum(['WHATSAPP', 'EMAIL', 'PHONE']);
export type ContactPreference = z.infer<typeof ContactPreference>;

export const Day = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);
export type Day = z.infer<typeof Day>;

export const StudentStatus = z.enum([
  'ACTIVE',
  'SUSPENDED',
  'EXPELLED',
  'TRANSFERRED',
  'DROPPED_OUT',
  'GRADUATED',
  'INACTIVE',
  'DECEASED',
]);
export type StudentStatus = z.infer<typeof StudentStatus>;

export const TransportMode = z.enum([
  'BUS',
  'WALK',
  'CAR',
  'MOTO',
  'TAXI',
  'PARENT',
  'OTHER',
]);
export type TransportMode = z.infer<typeof TransportMode>;

export const StaffPosition = z.enum([
  'SECRETARY',
  'GUARDIAN',
  'SUPERVISOR',
  'ACCOUNTANT',
  'LIBRARIAN',
  'NURSE',
  'CLEANER',
  'MAINTENANCE',
  'OTHER',
]);
export type StaffPosition = z.infer<typeof StaffPosition>;

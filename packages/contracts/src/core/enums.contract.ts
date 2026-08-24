import {z} from "zod"
export const DisciplinaryType = z.enum(['SUSPENSION', 'EXPULSION', 'WARNING']);
export type DisciplinaryType = z.infer<typeof DisciplinaryType>;

export const SchoolRole = z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF']);
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

export const TransportMode = z.enum(['BUS', 'WALK', 'CAR', 'MOTO', 'TAXI', 'PARENT', 'OTHER']);
export type TransportMode = z.infer<typeof TransportMode>;

export const GroupType = z.enum(['SOLO', 'MULTIPLE']);
export type GroupType = z.infer<typeof GroupType>;

export const SessionStatus = z.enum(['FINISHED', 'STARTED']);
export type SessionStatus = z.infer<typeof SessionStatus>;

export const PermissionModule = z.enum([
    'ATTENDANCE',
    'ACADEMICS',
    'USERS',
    'FINANCE',
    'SETTINGS',
]);
export type PermissionModule = z.infer<typeof PermissionModule>;

export const PermissionCode = z.enum([
    'MARK_STUDENT_ATTENDANCE',
    'MARK_TEACHER_ATTENDANCE',
    'MARK_STAFF_ATTENDANCE',
    'VIEW_ATTENDANCE_REPORTS',
    'MANAGE_CLASSES',
    'MANAGE_SUBJECTS',
    'INPUT_GRADES',
    'PUBLISH_BULLETINS',
    'CREATE_USER',
    'UPDATE_USER',
    'DELETE_USER',
    'MANAGE_USER_PERMISSIONS',
    'MANAGE_PAYMENTS',
    'VIEW_FINANCIAL_REPORTS',
]);
export type PermissionCode = z.infer<typeof PermissionCode>;

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

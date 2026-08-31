import { z } from 'zod';
import {
  ContactPreference,
  Day,
  DisciplinaryType,
  PermissionCode,
  PermissionModule,
  RelationType,
  SchoolRole,
  StudentStatus,
  TransportMode,
} from './enums.contract.ts';
import { SchoolContract } from './school.contract.ts';
import { UserContract } from '../auth';

// --- Teacher ---
export const TeacherContract = z.object({
  id: z.cuid2(),
  needAdminConfirm: z.boolean().default(false),
  schoolUserId: z.string().nullable().optional(),
  tempSchoolUserId: z.string().nullable().optional(),
  diploma: z.string().nullable().optional(),
  experience: z.string().nullable().optional(),
  hireDate: z.coerce.date().nullable().optional(),
  isActive: z.boolean().default(true),
  salary: z.number().nullable().optional(),
  department: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
  bio: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
  pendingAssignments: z.record(z.string(), z.any()).nullable().optional(), // Json
});
export type TeacherContract = z.infer<typeof TeacherContract>;

export const StaffContract = z.object({
  id: z.uuid(),
  schoolUserId: z.uuid(),
  hireDate: z.string(),
  position: z.enum(['SECRETARY']),
  positionOther: z.string().nullish(),
  salary: TeacherContract.shape.salary,
  department: TeacherContract.shape.department,
  createdAt: TeacherContract.shape.createdAt,
  updatedAt: TeacherContract.shape.updatedAt,
});

export type StaffContract = z.infer<typeof StaffContract>;

export const TempSchoolUserContract = z.object({
  id: z.cuid2(),
  schoolId: z.string(),
  userId: z.string(),
  role: SchoolRole,
  student: z
    .lazy(() => StudentContract)
    .nullable()
    .optional(),
  teacher: z
    .lazy(() => TeacherContract)
    .nullable()
    .optional(),
  staff: StaffContract,
});
export type TempSchoolUserContract = z.infer<typeof TempSchoolUserContract>;

// --- SchoolUser ---
export const SchoolUserContract = z.object({
  id: z.uuid(),
  schoolId: z.uuid().nullish(),
  userId: z.string().nullish(),
  isActive: z.boolean().default(true),
  role: SchoolRole,
  isOwner: z.boolean().default(false),
  createdAt: z.coerce
    .date()
    .default(() => new Date())
    .nullish(),
  parent: z.lazy(() => ParentContract.nullish()).nullish(),
  staff: z.any().nullish(), // Staff non défini
  student: z
    .lazy(() => StudentContract)
    .nullable()
    .nullish(),
  teacher: z.lazy(() => TeacherContract).nullish(),
  permissions: z.array(z.lazy(() => SchoolUserPermissionContract)).nullish(),
  school: z.lazy(() => SchoolContract.nullish()).nullish(),
});
export type SchoolUserContract = z.infer<typeof SchoolUserContract>;

// --- SchoolProfile ---
export const SchoolProfileContract = z.object({
  id: z.cuid2(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  schoolUserId: z.string(),
  schoolId: z.uuid(),
});
export type SchoolProfileContract = z.infer<typeof SchoolProfileContract>;

// --- Student ---
export const StudentContract = z.object({
  id: z.uuid(),
  needAdminConfirm: z.boolean().default(false),
  tempSchoolUserId: z.string().nullable().optional(),
  schoolProfile: SchoolProfileContract.optional(),
  user: UserContract.optional(),

  schoolId: z.uuid(),
  classId: z.string(),
  profileId: z.string(),
  matricule: z.string(),
  enrollmentYear: z.string(),
  enrollmentDate: z.coerce.date().nullable().optional(),
  studentNumber: z.number().int(),
  bloodGroup: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  medicalCondition: z.string().nullable().optional(),
  schoolUserId: z.string().nullable().optional(),
  birthDate: z.coerce.date(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
  birthPlace: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  previousClass: z.string().nullable().optional(),
  previousLevel: z.string().nullable().optional(),
  birthCertificateNumber: z.string().nullable().optional(),
  previousSchool: z.string().nullable().optional(),
  transportMode: TransportMode.default('WALK'),
  status: StudentStatus.default('ACTIVE'),
});

// --- SchoolSettings ---
export const SchoolSettingsContract = z.object({
  id: z.cuid2(),
  schoolId: z.string(),
  lessonDuration: z.number().int().default(50),
  startHour: z.number().int().default(8),
  endHour: z.number().int().default(18),
  daysOfWeek: z.array(Day),
  breakStartHour: z.number().int().default(12),
  breakDuration: z.number().int().default(60),
  // lists: non défini
});
export type SchoolSettingsContract = z.infer<typeof SchoolSettingsContract>;

// --- Permission ---
export const PermissionContract = z.object({
  id: z.cuid2(),
  code: PermissionCode,
  name: z.string(),
  module: PermissionModule,
  description: z.string().nullable().optional(),
  schoolUserPermissions: z
    .array(z.lazy(() => SchoolUserPermissionContract))
    .optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
});
export type PermissionContract = z.infer<typeof PermissionContract>;

// --- SchoolUserPermission ---
export const SchoolUserPermissionContract = z.object({
  id: z.cuid2(),
  schoolUserId: z.string(),
  permissionId: z.string(),
});
export type SchoolUserPermissionContract = z.infer<
  typeof SchoolUserPermissionContract
>;

// --- StudentDisciplinaryAction ---
export const StudentDisciplinaryActionContract = z.object({
  id: z.string().cuid(),
  studentId: z.string(),
  type: DisciplinaryType,
  reason: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  student: z.lazy(() => StudentContract),
});
export type StudentDisciplinaryActionContract = z.infer<
  typeof StudentDisciplinaryActionContract
>;

// --- Parent ---
export const ParentContract = z.object({
  id: z.cuid2(),
  schoolUserId: z.string().nullable().optional(),
  tempSchoolUserId: z.string(),
  profession: z.string().nullable().optional(),
  needAdminConfirm: z.boolean().default(false),
  isDelegate: z.boolean().default(false),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
  contactPreference: ContactPreference.nullable().default('WHATSAPP'),
  tempSchoolUser: z
    .lazy(() => TempSchoolUserContract)
    .nullable()
    .optional(),
});
export type ParentContract = z.infer<typeof ParentContract>;

export type StudentContract = z.infer<typeof StudentContract>;

// --- ParentStudent ---
export const ParentStudentContract = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
  createdAt: z.coerce.date<Date>().default(() => new Date()),
  parentId: z.uuid(),
  relationType: RelationType,
  parent: z.lazy(() => ParentContract),
  student: z.lazy(() => StudentContract),
  needAdminConfirm: z.boolean().default(false),
});
export type ParentStudentContract = z.infer<typeof ParentStudentContract>;

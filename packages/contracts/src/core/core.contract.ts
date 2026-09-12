import { z } from 'zod';
import {
  ContactPreference,
  Day,
  DisciplinaryType,
  PermissionAction,
  PermissionModule,
  PermissionSubject,
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
  schoolUserId: z.string().nullish(),
  tempSchoolUserId: z.string().nullish(),
  diploma: z.string().nullish(),
  experience: z.string().nullish(),
  hireDate: z.coerce.date().nullish(),
  isActive: z.boolean().default(true),
  salary: z.number().nullish(),
  department: z.string().nullish(),
  specialization: z.string().nullish(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
  bio: z.string().nullish(),
  cvUrl: z.string().nullish(),
  pendingAssignments: z.record(z.string(), z.any()).nullish(), // Json
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
    .date<Date | undefined>()
    .default(() => new Date())
    .optional(),
  parent: z.lazy(() => ParentContract.nullish()).nullish(),
  staff: z.lazy(() => StaffContract).nullish(),
  student: z
    .lazy(() => StudentContract)
    .nullable()
    .nullish(),
  teacher: z.lazy(() => TeacherContract).nullish(),
  permissions: z.array(z.lazy(() => PermissionContract)).optional(),
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
  avatarUrl: z.string().nullish(),
  bio: z.string().nullish(),
  schoolUserId: z.string(),
  schoolId: z.uuid(),
});
export type SchoolProfileContract = z.infer<typeof SchoolProfileContract>;

// --- Student ---
export const StudentContract = z.object({
  id: z.uuid(),
  needAdminConfirm: z.boolean().default(false),
  tempSchoolUserId: z.string().nullish(),
  schoolProfile: SchoolProfileContract.optional(),
  user: UserContract.optional(),

  schoolId: z.uuid(),
  classId: z.string(),
  profileId: z.string().nullish(),
  matricule: z.string(),
  enrollmentYear: z.string(),
  enrollmentDate: z.coerce.date().nullish(),
  studentNumber: z.number().int(),
  bloodGroup: z.string().nullish(),
  allergies: z.string().nullish(),
  medicalCondition: z.string().nullish(),
  schoolUserId: z.string().nullish(),
  birthDate: z.coerce.date(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date<Date>().optional(),
  deletedAt: z.coerce.date<Date>().nullish(),
  birthPlace: z.string().nullish(),
  nationality: z.string().nullish(),
  previousClass: z.string().nullish(),
  previousLevel: z.string().nullish(),
  birthCertificateNumber: z.string().nullish(),
  previousSchool: z.string().nullish(),
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
  subject: PermissionSubject,
  action: PermissionAction,
  name: z.string(),
  module: PermissionModule,
  description: z.string().nullish(),
  schoolUserPermissions: z
    .array(z.lazy(() => SchoolUserPermissionContract))
    .optional(),
  createdAt: z.coerce
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.coerce.date().optional(),
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
  endDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date().default(() => new Date()),
  student: z.lazy(() => StudentContract),
});
export type StudentDisciplinaryActionContract = z.infer<
  typeof StudentDisciplinaryActionContract
>;

// --- Parent ---
export const ParentContract = z.object({
  id: z.cuid2(),
  schoolUserId: z.string().nullish(),
  tempSchoolUserId: z.string().nullish(),
  profession: z.string().nullable(),
  needAdminConfirm: z.boolean().default(false),
  isDelegate: z.boolean().default(false),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date(),
  contactPreference: ContactPreference.nullable().default('WHATSAPP'),
  tempSchoolUser: z.lazy(() => TempSchoolUserContract).nullish(),
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

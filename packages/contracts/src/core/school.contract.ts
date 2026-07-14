import { z } from 'zod';

export const SchoolContract = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  address: z.string(),
  logo: z.string().nullable(),
  slug: z.string().nullable(),
  createdAt: z.string().optional(),
});

export const SchoolRole = z.enum([
  'ADMIN',
  'TEACHER',
  'STUDENT',
  'STAFF',
  'PARENT',
]);

export const TeacherContract = z.object({
  id: z.uuid(),
  schoolUserId: z.string(),
  diploma: z.string().nullish(),
  experience: z.string().nullable(),
  hireDate: z.string(),
  isActive: z.boolean(),
  bio: z.string().optional(),
  cvUrl: z.string().nullable(),
  salary: z.coerce.number<number>(),
  department: z.string().nullable(),
  specialization: z.string().nullable(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export const StaffContract = z.object({
  id: z.uuid(),
  schoolUserId: z.uuid(),
  hireDate: z.string(),
  position: z.enum(['SECREATERY']),
  positionOther: z.string().nullish(),
  salary: TeacherContract.shape.salary,
  department: TeacherContract.shape.department,
  createdAt: TeacherContract.shape.createdAt,
  updatedAt: TeacherContract.shape.updatedAt,
});

export const SchoolUserContract = z.object({
  id: z.uuid(),
  schoolId: z.string().optional(),
  role: SchoolRole,
  teacher: TeacherContract.optional(),
  StaffContract: StaffContract.optional(),
});

export type SchoolRole = z.infer<typeof SchoolRole>;
export type TeacherContract = z.infer<typeof TeacherContract>;
export type SchoolUserContract = z.infer<typeof SchoolUserContract>;
export type StaffContract = z.infer<typeof StaffContract>;
export type SchoolContract = z.infer<typeof SchoolContract>;

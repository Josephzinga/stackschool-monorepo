import {roleDataSchema, schoolDataSchema, SchoolRole,} from '@stackschool/contracts';
import {z} from 'zod';

export const HandleSchoolDataInput = z.object({
  userId: z.uuid(),
  schoolData: schoolDataSchema,
  role: SchoolRole,
});

export const HandleRoleDataInput = z.object({
  userId: z.uuid(),
  schoolId: z.uuid(),
  roleData: roleDataSchema,
  isNewSchool: z.boolean().default(false)
});

export type HandleSchoolDataInput = z.infer<typeof HandleSchoolDataInput>;
export type HandleRoleDataInput = z.infer<typeof HandleRoleDataInput>;

import {
  profileSchema,
  roleDataSchema,
  schoolDataSchema,
} from '@stackschool/shared';
import { z } from 'zod';

export type SaveProfileDto = z.infer<typeof profileSchema>;

export type SaveRoleDto = z.infer<typeof roleDataSchema>;

export type SaveSchoolDto = z.infer<typeof schoolDataSchema>;

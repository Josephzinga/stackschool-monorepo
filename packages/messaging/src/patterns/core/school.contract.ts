import { z } from 'zod';
import { SchoolContract } from '@stackschool/contracts';
export type { SchoolContract } from '@stackschool/contracts';

export const createSchoolInput = SchoolContract;
export type CreateSchoolInput = z.infer<typeof createSchoolInput>;

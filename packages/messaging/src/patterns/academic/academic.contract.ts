import { z } from 'zod';

export const FindTeacherIdsByClassOrSubject = z.object({
  schoolId: z.uuid(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
});

export type FindTeacherIdsByClassOrSubject = z.infer<
  typeof FindTeacherIdsByClassOrSubject
>;

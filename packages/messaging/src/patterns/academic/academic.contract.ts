import { z } from 'zod';

export const FindTeacherIdsByClassOrSubject = z.object({
  schoolId: z.uuid(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
});

export const FindClassSubjectInput = z.object({
  subjectId: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  schoolId: z.uuid(),
});

export type FindClassSubjectInput = z.infer<typeof FindClassSubjectInput>;

export type FindTeacherIdsByClassOrSubject = z.infer<
  typeof FindTeacherIdsByClassOrSubject
>;

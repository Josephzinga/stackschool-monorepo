import z from 'zod';

export const FindTeachersPaginatedInput = z.object({
  schoolId: z.uuid(),
  department: z.string().nullish(),
  id: z.string().nullish(),
  hasLessonOnly: z.boolean(),
  page: z.number().min(0),
  limit: z.number().min(1).max(100),
});

export const FindTeachersPaginatedResponse = z.object({
  teachers: z.array(
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      weeklyHours: z.number().nullish(),
    }),
  ),
  totalCount: z.number(),
});

export const FindOneTeacherInput = z.object({
  id: z.string(),
  schoolId: z.uuid(),
});

export type FindOneTeacherInput = z.infer<typeof FindOneTeacherInput>;

export type FindTeachersPaginatedInput = z.infer<
  typeof FindTeachersPaginatedInput
>;
export type FindTeachersPaginatedResponse = z.infer<
  typeof FindTeachersPaginatedResponse
>;

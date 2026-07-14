import { z } from 'zod';

export enum AttendanceStatusEnum {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export const markAttendanceSchema = z.object({
  attendances: z.array(
    z
      .object({
        id: z.string(),
        status: z.enum(AttendanceStatusEnum).nullable(),
        date: z.coerce.date(),
        classId: z.string().optional().nullable(),
        userType: z.enum(['STUDENT', 'TEACHER', 'STAFF']),
        isSubjectMode: z.boolean(),
        subjectId: z.string().optional(),
      })
      .superRefine((val, ctx) => {
        if (val.isSubjectMode) {
          if (!val.subjectId) {
            ctx.addIssue({
              code: 'custom',
              path: ['subjectId'],
              message:
                "La matiéres est requis lorsque c'est un enseiganant qui fait l'appel.",
            });
          }
          if (!val.classId) {
            ctx.addIssue({
              code: 'custom',
              path: ['classId'],
              message:
                "La classe est requis lorsque c'est un enseignant qui fait l'appel.",
            });
          }
        }
      }),
  ),
});
export type MarkAttendanceFormType = z.infer<typeof markAttendanceSchema>;

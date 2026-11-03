import { z } from 'zod';
import { AttendanceStatus } from './operation.contract';

export const MarkAttendanceSchema = z.object({
  attendances: z.array(
    z
      .object({
        id: z.string(),
        status: AttendanceStatus.nullable(),
        date: z.coerce.date<Date>(),
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
                "Les matières sont requis lorsque c'est un enseignant qui fait l'appel.",
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
export type MarkAttendanceSchema = z.infer<typeof MarkAttendanceSchema>;

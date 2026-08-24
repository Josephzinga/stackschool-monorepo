import { z } from 'zod';

export const teacherAssignmentDraft = z.object({
  classId: z.string().uuid(),
  subjectIds: z.array(z.string().uuid()),
  isMainTeacher: z.boolean(),
});
export type peacherAssignmentDraft = z.infer<typeof teacherAssignmentDraft>;

export const parentChildDraft = z.object({
  studentId: z.uuid().optional(), // rempli si matché via recherche
  studentRawName: z.string().optional(), // fallback si non matché
  relationType: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']),
});
export type ParentChildDraft = z.infer<typeof parentChildDraft>;

import { z } from 'zod';

export const TeacherAssignmentDraft = z.object({
  classId: z.cuid2(),
  subjectIds: z.array(z.cuid2()),
  isMainTeacher: z.boolean(),
});
export type TeacherAssignmentDraft = z.infer<typeof TeacherAssignmentDraft>;

export const ParentChildDraft = z.object({
  studentId: z.uuid().optional(), // rempli si matché via recherche
  studentRawName: z.string().optional(), // fallback si non matché
  relationType: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']),
});
export type ParentChildDraft = z.infer<typeof ParentChildDraft>;

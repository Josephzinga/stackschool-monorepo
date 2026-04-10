import { z } from 'zod';
import { profileSchema } from './auth.schema';

export const createTeacherSchema = z.object({
  firstname: z.string().min(2, 'Le prénom est requis'),
  lastname: z.string().min(2, 'Le nom est requis'),
  gender: profileSchema.shape.gender,
  email: profileSchema.shape.email,
  phoneNumber: z.string().optional(),
  diploma: z.string().min(2, 'Le diplôme est requis'),
  specialization: z.string().min(2, 'La spécialité est requise'),
});

export const classSubjectAssignmentSchema = z.object({
  classId: z.cuid('Identifiant invalide.'),
  subjectIds: z.array(z.cuid()).min(1, 'Au moins une matière est requise'),
});

export type CreateTeacherValues = z.infer<typeof createTeacherSchema>;
export type ClassSubjectAssignment = z.infer<
  typeof classSubjectAssignmentSchema
>;

import { z } from 'zod';
import { profileSchema } from '../auth';

export const CreateTeacherSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  gender: profileSchema.shape.gender,
  email: profileSchema.shape.email,
  phoneNumber: z.string().nullable(),
  diploma: z.string().min(2, 'Le diplôme est requis'),
  specialization: z.string().min(2, 'La spécialité est requise'),
});
export const ClassSubjectAssignmentSchema = z.object({
  classId: z.cuid2('Identifiant invalide.'),
  subjectIds: z.array(z.cuid2()).min(1, 'Au moins une matière est requise'),
});

export const TeacherAssignmentSchema = z.object({
  classId: z.cuid2('Identifiant invalide.').min(2, 'La classe est requise'),
  subjectIds: z
    .array(z.cuid2('Identifiant invalide.'))
    .min(1, 'Au moins une matière est requise'),
  teacherId: z
    .string('Identifiant invalide.')
    .min(1, "L'enseignant est requis"),
});
export type TeacherAssignmentSchema = z.infer<typeof TeacherAssignmentSchema>;
export type ClassSubjectAssignmentSchema = z.infer<
  typeof ClassSubjectAssignmentSchema
>;
export type CreateTeacherSchema = z.infer<typeof CreateTeacherSchema>;

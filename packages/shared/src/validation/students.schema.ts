import { z } from 'zod';
import { studentFormSchema } from './complete-profile.schema';
import { registerFormSchema } from './auth.schema';

export const searchStudentSchema = z.object({
  searchTerm: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères'),

  schoolId: z.cuid().min(1, "L'identifiant de l'école est requis"),
});
export const createStudentSchema = z.object({
  firstname: z.string().min(2, 'Le prénom est requis'),
  lastname: z.string().min(2, 'Le nom est requis'),
  email: registerFormSchema.shape.email,
  phoneNumber: registerFormSchema.shape.phoneNumber,
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: studentFormSchema.shape.birthDate,
  birthPlace: studentFormSchema.shape.birthPlace.optional(),
  matricule: studentFormSchema.shape.matricule,
  classId: z.string().min(1, 'La classe est requise'),
  enrollmentYear: studentFormSchema.shape.enrollmentYear,
  fatherName: studentFormSchema.shape.fatherName,
  motherName: studentFormSchema.shape.motherName,
  nationality: z.string().min(1, 'La nationalité est requis'),
});

export type CreateStudentValues = z.infer<typeof createStudentSchema>;

export type SearchStudentParams = z.infer<typeof searchStudentSchema>;

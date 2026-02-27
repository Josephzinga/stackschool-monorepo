import { z } from 'zod';

export const searchStudentSchema = z.object({
  searchTerm: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères'),

  schoolId: z.cuid().min(1, "L'identifiant de l'école est requis"),
});
export const createStudentSchema = z.object({
  firstname: z.string().min(2, 'Le prénom est requis'),
  lastname: z.string().min(2, 'Le nom est requis'),
  email: z
    .string()
    .email({ pattern: z.regexes.email, message: 'Email invalide' })
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),

  matricule: z.string().min(1, 'Le matricule est requis'),
  classId: z.string().min(1, 'La classe est requise'),
  enrollmentYear: z.string().min(1, "L'année est requise"),

  fatherName: z
    .string()
    .min(3, 'Le nom du pére dois contenir au mois 3 caractère')
    .optional(),
  motherName: z
    .string()
    .min(3, 'Le nom de la mère dois contenir au mois 3 caractère')
    .optional(),
});

export type CreateStudentValues = z.infer<typeof createStudentSchema>;

export type SearchStudentParams = z.infer<typeof searchStudentSchema>;

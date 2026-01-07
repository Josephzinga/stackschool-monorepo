import { z } from 'zod';

export const searchStudentSchema = z.object({
  q: z.string().min(2, "La recherche doit contenir au moins 2 caractères").optional().or(z.literal('')),
  schoolId: z.string().min(1, "L'identifiant de l'école est requis"),
});

export type SearchStudentParams = z.infer<typeof searchStudentSchema>;

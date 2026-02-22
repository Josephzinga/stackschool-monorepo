import { z } from 'zod';
import { profileSchema } from './auth.schema';

export const createTeacherSchema = z.object({
  firstname: z.string().min(2, 'Le prénom est requis'),
  lastname: z.string().min(2, 'Le nom est requis'),
  gender: profileSchema.shape.gender,
  email: z
    .string()
    .email({ pattern: z.regexes.email, message: 'Email invalide' }),
  phoneNumber: z.string().optional(),
  diploma: z.string().min(2, 'Le diplôme est requis'),
  specialization: z.string().min(2, 'La spécialité est requise'),
  classIds: z.array(z.string()).optional(), // IDs des classes assignées
});

export type CreateTeacherValues = z.infer<typeof createTeacherSchema>;

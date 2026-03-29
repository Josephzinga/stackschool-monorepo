import { z } from 'zod';

// Liste des rôles possibles pour une invitation
const roles = ['TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'ADMIN'] as const;

export const createInvitationSchema = z
  .object({
    schoolId: z.string().min(1, "L'ID de l'école est requis"),
    role: z.enum(roles, {
      error: (issue) =>
        issue.input === undefined ? 'Le rôle est requis' : 'Rôle invalide',
    }),
    email: z
      .string()
      .email({ pattern: z.regexes.unicodeEmail, message: 'Email invalide' })
      .optional()
      .or(z.literal('')),
    phoneNumber: z
      .string()
      .min(8, 'Numéro de téléphone invalide')
      .optional()
      .or(z.literal('')),
    message: z.string().optional(),
    // Champs optionnels pour pré-remplissage
    studentId: z.string().optional(), // Pour lier un parents à un élève
    classId: z.string().optional(), // Pour pré-affecter une classe
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: 'Vous devez fournir au moins un email ou un numéro de téléphone',
    path: ['email'], // L'erreur s'attachera au champ email par défaut
  });

export type CreateInvitationData = z.infer<typeof createInvitationSchema>;

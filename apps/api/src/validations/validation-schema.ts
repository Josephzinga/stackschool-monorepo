import { z } from '@stackschool/shared';

export const resetPasswordApiSchema = z.object({
  token: z.string().min(16, 'Token invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
    .regex(
      /[^a-zA-Z0-9]/,
      'Le mot de passe doit contenir au moins un caractère spécial.',
    ),
});
export const validateUserFieldSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide.').optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, {
      message: 'Numéro invalide (format international recommandé, ex: +223...)',
    })
    .optional(),
});

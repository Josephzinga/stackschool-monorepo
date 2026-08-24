import {z} from 'zod';
import {ACCEPTED_IMAGE_TYPES, AVATAR_MAX_FILE_SIZE} from "../constant/upload.config.ts";

z.config(z.locales.fr());
export enum GenderEnum {
  Female = 'FEMALE',
  Male = 'MALE',
}
export const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(3, "L'identifiant est requis")
    .refine((value) => {
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) return true;

      // Validation téléphone (format international accepté)
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (phoneRegex.test(value.replace(/\s/g, ''))) return true;

      // Validation username (alphanumérique + underscores, 3-20 caractères)
      const usernameRegex = /^[a-zA-Z 0-9_]{3,20}$/;
      return usernameRegex.test(value);
    }, "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)"),

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

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
      .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères.")
      .refine(
        (value) => {
          // Validation email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) return true;

          // Validation téléphone (format international accepté)
          const phoneRegex = /^\+?[0-9]{8,15}$/;
          if (phoneRegex.test(value.replace(/\s/g, ''))) return true;

          // Validation username (alphanumérique + underscores, 3-20 caractères)
          const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
          return usernameRegex.test(value);
        },

        "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)",
      ),

    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
      .regex(
        /[^a-zA-Z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial.',
      ),

    email: z

      .email({
        pattern: z.regexes.email,
        message: 'Veuillez entrer un email valide.',
      })
      .optional()
      .or(z.literal('')),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^\+?[0-9]{8,15}$/,

        'Numéro invalide (format international recommandé, ex: +223...)',
      )
      .optional()
      .or(z.literal('')),

    confirm: z.string('La confirmation du mot de passe est requis.'),
  })
  .superRefine((data, ctx) => {
    // Vérifie la correspondance des mots de passe
    if (data.password !== data.confirm) {
      ctx.addIssue({
        path: ['confirm'],
        code: 'invalid_value',
        message: 'Les mots de passe ne correspondent pas.',
        values: [data.password, data.confirm],
      });
    }

    // Vérifie qu'au moins un moyen de contact est fourni
    const hasEmail = data.email && data.email.trim() !== '';
    const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== '';

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: 'invalid_value',
        path: ['email'],
        message: 'Veuillez fournir un email ou un numéro de téléphone.',
        values: [data.email, data.phoneNumber],
      });
      ctx.addIssue({
        code: 'invalid_value',
        path: ['phoneNumber'],
        message: 'Veuillez fournir un email ou un numéro de téléphone.',
        values: [data.email, data.phoneNumber],
      });
    }
  });

export const VerifyCodeSchema = z.object({
  code: z
    .string('Le code de vérification est requis.')
    .min(6, 'Le code doit contenir 6 chiffres.')
    .max(6, 'Le code doit contenir 6 chiffres.'),
});

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "L'identifiant est requis")
    .refine(
      (value) => {
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;

        // Validation téléphone (format international accepté)
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (phoneRegex.test(value.replace(/\s/g, ''))) return true;

        // Validation username (alphanumérique + underscores, 3-20 caractères)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (usernameRegex.test(value)) return true;

        return false;
      },

      "Veuillez entrer un email, numéro de téléphone valide ou nom d'utilisateur (3-20 caractères alphanumériques)",
    ),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
      .regex(
        /[^a-zA-Z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial.',
      ),
    confirm: registerFormSchema.shape.confirm,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm'],
        message: 'Les mots de passe ne correspondent pas.',
      });
    }
  });

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(3, 'Le prénom doit contenir au moins 3 caractères.')
      .max(30, 'Le prénom ne peut pas dépasser 30 caractères.'),
    lastName: z
      .string()
      .min(3, 'Le nom doit contenir au moins 3 caractères')
      .max(30, 'Le nom  ne peut pas dépasser 30 caractères.'),
    gender: z.enum(
      GenderEnum,
      'Veuillez sélectionner un genre valid. MALE ou FEMALE',
    ),
    avatarUrl: z.string().nullish(),
    address: z
      .string()
      .min(5, "L'adresse doit être plus précise")
      .max(200, "L'adresse est trop longue"),
    email: z
      .email({
        message: 'Veuillez entrer un email valide.',
      })
      .optional()
      .or(z.literal('')),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^\+?[0-9]{8,15}$/,
        'Numéro invalide (format international recommandé, ex: +223...)',
      )
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const hasEmail = data.email && data.email.trim() !== '';
    const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== '';

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Veuillez fournir un email ou un numéro de téléphone.',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['phoneNumber'],
        message: 'Veuillez fournir un email ou un numéro de téléphone.',
      });
    }
  });

export const avatarFileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
        (type) => ACCEPTED_IMAGE_TYPES.includes(type),
        { message: "Seuls les formats .jpg et .png sont supportés." }
    ),
    size: z.number().refine(
        (size) => size <= AVATAR_MAX_FILE_SIZE,
        { message: "La taille maximale du fichier est de 5 Mo." }
    ),
    buffer: z.instanceof(Buffer), // Contient les données binaires du fichier
});


export type AvatarFileType = z.infer<typeof avatarFileSchema>
export type ProfileFormType = z.infer<typeof profileSchema>;

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export type VerifyCodeFormType = z.infer<typeof VerifyCodeSchema>;

export type RegisterFormType = z.infer<typeof registerFormSchema>;

export type LoginFormType = z.infer<typeof loginFormSchema>;

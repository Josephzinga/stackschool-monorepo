import { z } from 'zod';

z.config(z.locales.fr());
export const createSchoolSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom de l'école doit contenir au moins 3 caractères")
    .max(100, 'Le nom est trop long'),
  address: z
    .string()
    .min(5, "L'adresse doit être plus précise")
    .max(200, "L'adresse est trop longue"),
  code: z.string().length(6, 'Le code doit contenir 6 caractères'),
});
// Schéma pour l'étape de sélection du rôle
export const roleStepSchema = z.object({
  role: z.enum(['TEACHER', 'STUDENT', 'PARENT', 'ADMIN']),
});

// Schéma pour les informations de l'étudiant
export const studentFormSchema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis'),
  birthDate: z.date({
    error: (issue) =>
      issue.input === undefined
        ? 'La date de naissance est requise'
        : 'Format de date invalide',
  }),
  classId: z.string().optional(), // Optionnel si pas encore affecté
  enrollmentYear: z.string().optional(),
  fatherName: z
    .string('Le nom du pére est requis')
    .min(3, 'Le nom du pére doit contenir au moins 3 caracteres'),
  motherName: z
    .string('Le nom de la mére est requise')
    .min(3, 'Le nom de la mére doit contenir au moins 3 caracteres'),
  nationality: z.string('La nationalité est requise'),
  birthPlace: z.string().min(5, 'Le lieu de naissance est invalide'),
});

// Schéma pour les informations du parent
export const parentFormSchema = z.object({
  childrenIds: z
    .array(z.string())
    .min(1, 'Veuillez sélectionner au moins un enfant.'),
});
export const invitationSchema = z.object({
  invitationCode: z
    .string()
    .min(5, "Le code d'invitation doit contenir au moins 6 lettre"),
});

// Schéma pour les informations de l'enseignant
export const teacherFormSchema = z.object({
  specialization: z.string().min(1, 'La spécialisation est requise'),
  diploma: z.string().optional(),
  experience: z.string().optional(),
  subjects: z.array(z.string()).optional(), // IDs des matières
});

// Schéma générique pour la sauvegarde de progression
export const saveProgressSchema = z.object({
  step: z.number().int().min(1),
  data: z.record(z.any()), // Données flexibles selon l'étape
});

// Types inférés
export type RoleStepData = z.infer<typeof roleStepSchema>;
export type InvitationFormData = z.infer<typeof invitationSchema>;
export type CreateSchoolType = z.infer<typeof createSchoolSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;
export type ParentFormData = z.infer<typeof parentFormSchema>;
export type TeacherFormData = z.infer<typeof teacherFormSchema>;
export type SaveProgressData = z.infer<typeof saveProgressSchema>;

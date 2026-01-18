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

// Schéma pour les informations de l'étudiant
export const studentFormSchema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis'),
  birthDate: z.date({
    error: (issue) =>
      issue.input === undefined
        ? 'La date de naissance est requise'
        : 'Format de date invalide',
  }),
  classId: z.string('Veillez sélectionner une classe'), // Optionnel si pas encore affecté
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
  children: z
    .array(
      z.object({
        id: z.cuid(),
        firstname: z.string(),
        lastname: z.string(),
        photo: z.string().optional(),
        relation: z.enum([
          'FATHER',
          'MOTHER',
          'GRAND_FATHER',
          'GRAND_MOTHER',
          'UNCLE',
          'AUNT',
          'OTHER',
          'GUARDIAN',
        ]),
      }),
    )
    .min(1, 'Veuillez sélectionner au moins un enfant.'),

  contactPreference: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  address: createSchoolSchema.shape.address,
  profession: z
    .string()
    .min(3, 'veillez entrez une profession valide')
    .optional(),
});

export const invitationSchema = z.object({
  invitationCode: z
    .string()
    .min(5, "Le code d'invitation doit contenir au moins 6 lettre"),
});

// Schéma pour les informations de l'enseignant
export const teacherSchema = z.object({
  diploma: z.string().min(2, 'Le diplôme est requis'),
  department: z.string().optional(),
  assignments: z
    .array(
      z.object({
        classId: z.string(),
        isMainTeacher: z.boolean().default(false).optional(),
        subjectIds: z
          .array(z.string())
          .min(1, 'Sélectionnez au moins une matière'),
        className: z.string().optional(),
        subjectNames: z.array(z.string()),
      }),
    )
    .min(1, 'Veuillez sélectionner au moins une classe'),
});
export const StaffFormSchema = z.object({
  position: z.string().min(2, 'Le poste est requis'),
  departement: z.string().min(2, 'Le département est requis'),
  hireDate: z.date().optional(),
  //...
});

// Types inférés
export type StaffFormValues = z.infer<typeof StaffFormSchema>;
export type InvitationFormData = z.infer<typeof invitationSchema>;
export type CreateSchoolType = z.infer<typeof createSchoolSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;
export type ParentFormData = z.infer<typeof parentFormSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;

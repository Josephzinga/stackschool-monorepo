import { z } from 'zod';
import { profileSchema } from '../../src/index.js';

z.config(z.locales.fr());

export enum RelationTypeEnum {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GRAND_FATHER = 'GRAND_FATHER',
  GRAND_MOTHER = 'GRAND_MOTHER',
  UNCLE = 'UNCLE',
  AUNT = 'AUNT',
  OTHER = 'OTHER',
  GUARDIAN = 'GUARDIAN',
}
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

export const schoolSelectedSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional().nullable(),
  address: z.string(),
  logo: z.string().optional().nullable(),
});

// Schéma global pour l'étape École (Union)
export const schoolDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create'),
    newSchool: createSchoolSchema,
  }),
  z.object({
    type: z.literal('join'),
    schoolSelected: schoolSelectedSchema,
  }),
  z.object({
    type: z.literal('invite'),
    schoolId: z.string(),
    invitationCode: z.string().optional(),
  }),
]);
export const ACADEMIC_YEAR_REGEX = /^(20\d{2})-(20\d{2})$/;

// Schéma pour les informations de l'étudiant

export const studentFormSchema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis'),
  birthDate: z.coerce.date({
    error: ({ input }) =>
      input === undefined
        ? 'Date de naissance requis'
        : 'Date de naissance invalide',
  }),
  classId: z.cuid('Id invalide'),
  enrollmentYear: z
    .string()
    .regex(ACADEMIC_YEAR_REGEX)
    .refine(
      (value) => {
        const [start, end] = value.split('-').map(Number);
        const current = new Date().getFullYear();
        return end === start + 1 && start >= 2000 && end <= current + 1;
      },
      { message: "Année d'inscription invalide" },
    ),
  fatherName: z.string().min(3, 'Le nom du père est requis').optional(),
  motherName: z.string().min(3, 'Le nom de la mère est requis').optional(),
  nationality: z.string().optional(),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
});

// Schéma pour les informations du parents
export const parentFormSchema = z.object({
  children: z
    .array(
      z.object({
        id: z.cuid2(),
        firstname: z.string(),
        lastname: z.string(),
        photo: z.string().optional(),
        relation: z.enum(RelationTypeEnum),
      }),
    )
    .min(1, 'Veuillez sélectionner au moins un enfant.'),

  contactPreference: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  profession: z
    .string()
    .min(3, 'Veuillez entrer une profession valide')
    .optional(),
});

export const invitationSchema = z.object({
  invitationCode: z
    .string()
    .min(5, "Le code d'invitation doit contenir au moins 6 lettres"),
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
        subjectNames: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export const StaffFormSchema = z.object({
  position: z.string().min(2, 'Le poste est requis'),
  departement: z.string().min(2, 'Le département est requis'),
  hireDate: z.coerce.date().optional(),
});

// Schéma global pour l'étape Rôle (Union)
export const roleDataSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('STUDENT'),
    student: studentFormSchema,
  }),
  z.object({
    role: z.literal('PARENT'),
    parent: parentFormSchema,
  }),
  z.object({
    role: z.literal('TEACHER'),
    teacher: teacherSchema,
  }),
  z.object({
    role: z.literal('STAFF'),
    staff: StaffFormSchema,
  }),
  z.object({
    role: z.literal('ADMIN'),
    admin: StaffFormSchema, // Ou un schéma spécifique admin
  }),
]);

export const completeProfileDataSchema = z
  .object({
    role: roleDataSchema.nullable(),
    profile: profileSchema.nullable(),
    school: schoolDataSchema.nullable(),
    currentStep: z.coerce.number<number>(),
  })
  .superRefine((data, ctx) => {
    if (data.currentStep === 1 && !data.school) {
      ctx.addIssue({
        code: 'custom',
        path: ['school'],
        message: "Vous devriez remplir les information de l'ecole",
      });
    }
    if (data.currentStep === 2 && !data.profile) {
      ctx.addIssue({
        code: 'custom',
        path: ['profile'],
        message: 'Remplisez le donné du profile',
      });
    }
  });

// Types inférés
export type StaffFormDataType = z.infer<typeof StaffFormSchema>;
export type InvitationFormData = z.infer<typeof invitationSchema>;
export type CreateSchoolType = z.infer<typeof createSchoolSchema>;
export type StudentFormDataType = z.infer<typeof studentFormSchema>;
export type ParentFormDataType = z.infer<typeof parentFormSchema>;
export type TeacherFormDataType = z.infer<typeof teacherSchema>;
export type ProfileFormDataType = z.infer<typeof profileSchema>;
export type SchoolDataType = z.infer<typeof schoolDataSchema>;
export type RoleDataType = z.infer<typeof roleDataSchema>;

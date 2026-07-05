import { z } from 'zod';
import {
  parentFormSchema,
  RelationTypeEnum,
  studentFormSchema,
} from './complete-profile.schema.js';
import { profileSchema, registerFormSchema } from './auth.schema.js';

export enum StudentStatusEnum {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPELLED = 'EXPELLED',
  TRANSFERRED = 'TRANSFERRED',
  DROPPED_OUT = 'DROPPED_OUT',
  GRADUATED = 'GRADUATED',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
}

export enum TransportModeEnum {
  BUS = 'BUS',
  WALK = 'WALK',
  PARENT = 'PARENT',
  MOTO = 'MOTO',
  OTHER = 'OTHER',
}

export const searchStudentSchema = z.object({
  schoolId: z.cuid().min(1, "L'identifiant de l'école est requis"),
});
export const createStudentSchema = z.object({
  // info profile
  firstname: z.string().min(2, 'Le prénom est requis'),
  lastname: z.string().min(2, 'Le nom est requis'),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(3, 'Veuillez entré une adresse valide').optional(),
  // info utilisateur optionnel
  email: registerFormSchema.shape.email.optional(),
  username: registerFormSchema.shape.username.optional(),
  phoneNumber: registerFormSchema.shape.phoneNumber.optional(),
  isActive: z.boolean().optional(),
  // info metier dispo
  status: z.enum(StudentStatusEnum).optional(),
  birthCertificateNumber: z.string().optional(),
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  studentNumber: z.number().optional(),
  enrollmentDate: z.coerce.date().optional(),
  transportMode: z.enum(TransportModeEnum).optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  birthDate: studentFormSchema.shape.birthDate,
  birthPlace: studentFormSchema.shape.birthPlace.optional(),
  matricule: studentFormSchema.shape.matricule,
  classId: z.string().min(1, 'La classe est requise'),
  enrollmentYear: studentFormSchema.shape.enrollmentYear,
  parentData: z.object({
    mode: z.enum(['CONNECT', 'CREATE']),
    parentId: z.cuid().optional(),
    newParent: z
      .object({
        firstname: profileSchema.shape.firstname.nonoptional(),
        lastname: profileSchema.shape.lastname.nonoptional(),
        address: profileSchema.shape.address,
        phoneNumber: profileSchema.shape.phoneNumber.nonoptional(),
        email: registerFormSchema.shape.email.optional(),
        gender: profileSchema.shape.gender.optional(),
        relationType: z.enum(RelationTypeEnum),
        profession: parentFormSchema.shape.profession.nonoptional(),
      })
      .optional(),
  }),
  nationality: z.string().min(1, 'La nationalité est requis'),
  // info medical
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  medicalCondition: z.string().optional(),
});

export type CreateStudentValues = z.infer<typeof createStudentSchema>;

export type SearchStudentParams = z.infer<typeof searchStudentSchema>;

import {z} from 'zod';
import {parentFormSchema, profileSchema, registerFormSchema, RelationTypeEnum, studentFormSchema} from "../auth";
import {StudentStatus, TransportMode} from "./enums.contract.ts";


export const searchStudentSchema = z.object({
  schoolId: z.uuid().min(1, "L'identifiant de l'école est requis"),
});
export const CreateStudentSchema = z.object({
  // info profile
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string('Veuillez entré une adresse valide').nullish(),
  // info utilisateur optionnel
  email: registerFormSchema.shape.email.optional(),
  username: registerFormSchema.shape.username.optional(),
  phoneNumber: registerFormSchema.shape.phoneNumber.optional(),
  isActive: z.boolean().optional(),
  // info metier dispo
  status: StudentStatus.optional(),
  birthCertificateNumber: z.string().optional(),
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  studentNumber: z.number().optional(),
  enrollmentDate: z.coerce.date<Date>().optional(),
  transportMode: TransportMode.optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  birthDate: studentFormSchema.shape.birthDate,
  birthPlace: z.string().optional(),
  matricule: studentFormSchema.shape.matricule,
  classId: z.cuid2().min(1, 'La classe est requise'),
  enrollmentYear: studentFormSchema.shape.enrollmentYear,
  parentData: z.object({
    mode: z.enum(['CONNECT', 'CREATE']),
    parentId: z.uuid().optional(),
    newParent: z
      .object({
        firstName: profileSchema.shape.firstName.nonoptional(),
        lastName: profileSchema.shape.lastName.nonoptional(),
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

export type CreateStudentSchema = z.infer<typeof CreateStudentSchema>;

export type SearchStudentParams = z.infer<typeof searchStudentSchema>;

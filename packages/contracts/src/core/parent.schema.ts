import { z } from 'zod';
import { CreateTeacherSchema } from './teacher.ts';
import { RelationType } from './enums.contract.ts';

export const ParentStudentSchema = z
  .object({
    parentId: z.string().optional(),
    studentId: z.string().optional(),
    relationType: RelationType,
  })
  .superRefine((data, tx) => {
    if (!data.parentId && !data.studentId) {
      return tx.addIssue({
        code: 'custom',
        message: "L'identifiant du parent où de élève doit être fournit.",
        path: ['parentId', 'studentId'],
      });
    }
  });

export const CreateParentSchema = z.object({
  firstName: CreateTeacherSchema.shape.firstName,
  lastName: CreateTeacherSchema.shape.lastName,
  email: z.email(),
  phoneNumber: CreateTeacherSchema.shape.phoneNumber,
  gender: z.enum(['MALE', 'FEMALE']),
  profession: z.string().min(1, 'La profession est requis.'),
  address: z.string().min(3, 'Veillez entré un address valide.'),
  children: z.array(ParentStudentSchema),
});

export const UpdateParentSchema = z.object({
  id: z.string(),
  firstName: CreateTeacherSchema.shape.firstName.optional(),
  lastName: CreateTeacherSchema.shape.lastName.optional(),
  email: z.email().nullish(),
  phoneNumber: CreateTeacherSchema.shape.phoneNumber.nullish(),
  gender: CreateParentSchema.shape.gender.optional(),
  profession: CreateParentSchema.shape.profession.optional(),
  address: CreateParentSchema.shape.address.optional(),
  children: z
    .array(
      ParentStudentSchema.extend({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        avatarUrl: z.string().optional(),
        class: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

export type ParentStudentSchema = z.infer<typeof ParentStudentSchema>;

export type UpdateParentSchema = z.infer<typeof UpdateParentSchema>;

export type CreateParentSchema = z.infer<typeof CreateParentSchema>;

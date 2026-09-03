import { z } from 'zod';
import { CreateTeacherSchema } from './teacher.ts';
import { RelationTypeEnum } from '../auth';

export const CreateParentSchema = z.object({
  firstName: CreateTeacherSchema.shape.firstName,
  lastName: CreateTeacherSchema.shape.lastName,
  email: CreateTeacherSchema.shape.email,
  phoneNumber: CreateTeacherSchema.shape.phoneNumber,
  gender: z.enum(['MALE', 'FEMALE']),
  profession: z.string().min(1, 'La profession est requis.'),
  address: z.string().min(3, 'Veillez entré un address valide.'),
  children: z.array(
    z.object({
      id: z.string('Veillez selectionner un élève'),
      relationType: z.enum(RelationTypeEnum),
    }),
  ),
});

export type CreateParentSchema = z.infer<typeof CreateParentSchema>;

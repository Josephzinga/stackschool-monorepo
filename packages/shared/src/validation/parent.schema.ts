import { z } from 'zod';
import { createTeacherSchema } from './create-list-teacher.schema';
import { RelationTypeEnum } from './complete-profile.schema';

export const createParentSchema = z.object({
  firstname: createTeacherSchema.shape.firstname,
  lastname: createTeacherSchema.shape.lastname,
  email: createTeacherSchema.shape.email,
  phoneNumber: createTeacherSchema.shape.phoneNumber,
  profession: z.string().min(1, 'La profession est requis'),
  address: z.string().min(3, 'Veillez entré un address valide'),
  children: z.array(
    z.object({
      id: z.string('Veillez selectionner un élève'),
      relationType: z.enum(RelationTypeEnum),
    }),
  ),
});

export type CreateParentFormData = z.infer<typeof createParentSchema>;

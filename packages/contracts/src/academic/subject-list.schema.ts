import z from 'zod';

export enum SubjectCategory {
  General = 'GENERAL',
  Literary = 'LITERARY',
  Scientific = 'SCIENTIFIC',
  Sport = 'SPORT',
}

export const createSubjectForm = z.object({
  name: z.string().min(1, 'Le nom de la matière est requis.'),
  code: z
    .string()
    .min(1, 'Le code de la matière est requis')
    .max(
      10,
      'Le code de la matière ne peut pas contenir plus de 10 caractères',
    ),
  mainTeacherId: z.string().optional(),
  category: z.enum(SubjectCategory),
  classSubjects: z
    .array(
      z.object({
        classId: z
          .string()
          .min(1, 'Veuillez sélectionner au moins une classe.'),
        coefficient: z
          .number()
          .min(1, 'Le coefficient de la matière est requis.'),
        weeklyHours: z.number(),
      }),
    )
    .optional(),
});

export type CreateSubjectForm = z.infer<typeof createSubjectForm>;

export const createClassSubjectSchema = z
  .object({
    id: z.string().optional(),
    classId: z.cuid2('ID de classe invalide').optional(),
    teacherId: z.string().optional(),
    subjectId: z.cuid2('ID de matière invalide'),
    coefficient: z.coerce
      .number<number>()
      .min(1, 'Le coefficient ne doit pas être inférieur ou égal à 0'),
    weeklyHours: z.coerce
      .number<number>()
      .min(1, "Le nombre d'heures ne doit pas être inférieur ou égal à 0")
      .optional(),
  })
  .refine(
    (data) => {
      return !!data.id || !!data.classId;
    },
    {
      error: 'La classe est requise',
      path: ['classId'],
    },
  );

export type CreateClassSubjectFormData = z.infer<
  typeof createClassSubjectSchema
>;

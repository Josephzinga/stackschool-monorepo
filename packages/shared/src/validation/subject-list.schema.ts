import z from 'zod';
enum SubjectCategory {
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
      'Le code de la matière ne peut pas contenir plus de 10 caracteres',
    ),
  mainTeacherId: z.string().optional(),
  category: z
    .enum(SubjectCategory)
    .refine((value) =>
      value === undefined
        ? 'La category de la matière est requis'
        : 'Catégory invalide',
    ),
  classSubject: z
    .array(
      z.object({
        classId: z
          .string()
          .min(1, 'Veuillez selectionner ou moins une classe.'),
        coefficient: z
          .number()
          .min(1, 'Le coefficient de la matière est requis.'),
        weeklyHours: z.number(),
      }),
    )
    .optional(),
});
export type CreateSubjectForm = z.infer<typeof createSubjectForm>;
export const createClassSubjectSchema = z.object({
  id: z.string().optional(),
  classId: z
    .cuid()
    .refine((value) =>
      value === undefined ? "L'id de la classe est requis" : 'Id invalid',
    )
    .optional(),
  teacherId: z
    .cuid()
    .refine((value) =>
      value === undefined ? "L'id du professeur est requis" : 'Id invalid',
    ),
  subjectId: z
    .cuid()
    .refine((value) =>
      value === undefined ? "L'id de la matière est requis" : 'Id invalid ',
    ),
  coefficient: z.coerce
    .number()
    .min(1, 'Le coéfficient ne dois pas être inferieur ou egal à 0'),
  weeklyHours: z.coerce
    .number()
    .min(1, 'Les nombres des heures ne dois pas être inferieur ou egal à 0')
    .optional(),
});
export type CreateClassSubjectFormData = z.infer<
  typeof createClassSubjectSchema
>;

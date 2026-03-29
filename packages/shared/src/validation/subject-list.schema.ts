import z from 'zod';

export enum LessonStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Ongoing = 'ONGOING',
  Planned = 'PLANNED',
  Postponed = 'POSTPONED',
}
enum SubjectCategory {
  General = 'GENERAL',
  Literary = 'LITERARY',
  Scientific = 'SCIENTIFIC',
  Sport = 'SPORT',
}

export const createLessonSchema = z
  .object({
    mode: z.enum(['TEACHER', 'CLASS']),
    startTime: z.string(),
    endTime: z.string(),
    day: z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ]),
    status: z.enum(LessonStatus).optional(),
    subjectId: z.string().min(1, 'Veuillez selectionner une matière.'),
    teacherId: z
      .string()
      .min(1, 'Veuillez selectionner un enseignant.')
      .optional(),
    groupId: z.cuid().min(1, 'Veuillez selectionner une classe.').optional(),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.startTime.split(':').map(Number);
      const [endH, endM] = data.endTime.split(':').map(Number);
      return endH > startH || (endH === startH && endM > startM);
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ['endTime'],
    },
  );
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;

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

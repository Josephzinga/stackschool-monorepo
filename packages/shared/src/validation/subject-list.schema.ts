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

/**
 * Fonction utilitaire pour valider que l'heure de fin est après l'heure de début
 */
const validateTimeRange = (data: { startTime: string; endTime: string }) => {
  const [startH, startM] = data.startTime.split(':').map(Number);
  const [endH, endM] = data.endTime.split(':').map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM))
    return false;

  return endH > startH || (endH === startH && endM > startM);
};

export const createLessonSchema = z
  .object({
    id: z.cuid().optional(),
    mode: z.enum(['TEACHER', 'CLASS']),

    startTime: z
      .string()
      .trim()
      .min(4, 'Veuillez entrer une heure valide')
      .max(5, "Format d'heure invalide (HH:mm)"),
    endTime: z
      .string()
      .trim()
      .min(4, 'Veuillez entrer une heure valide')
      .max(5, "Format d'heure invalide (HH:mm)"),
    day: z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ]),
    status: z.enum(LessonStatus).optional(),
    subjectId: z
      .string('Veuillez sélectionner une matière.')
      .min(1, 'Veuillez sélectionner une matière.'),
    teacherId: z.string().min(1, 'Veuillez sélectionner un enseignant.'),
    groupId: z.cuid().optional(),
    classId: z.cuid().optional(),
  })
  .refine(validateTimeRange, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['endTime'],
  })
  .refine(
    (data) => {
      // Si on est en mode CLASS, on doit avoir un enseignant sélectionné
      return !(data.mode === 'CLASS' && !data.teacherId);
    },
    {
      message: 'Veuillez sélectionner un enseignant pour cette classe',
      path: ['teacherId'],
    },
  )
  .refine(
    (data) => {
      // Si on est en mode TEACHER, on doit avoir une classe/groupe sélectionné
      return !(data.mode === 'TEACHER' && !data.groupId && !data.classId);
    },
    {
      message: 'Veuillez sélectionner une classe pour cet enseignant',
      path: ['groupId'],
    },
  );

export const updateLessonSchema = z.object({
  id: z.cuid(),
  mode: z.enum(['TEACHER', 'CLASS']),
  startTime: createLessonSchema.shape.startTime.optional(),
  endTime: createLessonSchema.shape.endTime.optional(),
  day: createLessonSchema.shape.day.optional(),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
  groupId: z.string().optional(),
});

export type UpdateLessonFormData = z.infer<typeof updateLessonSchema>;
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;

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
  classSubject: z
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
    classId: z.cuid('ID de classe invalide').optional(),
    teacherId: z.string().optional(),
    subjectId: z.cuid('ID de matière invalide'),
    coefficient: z.coerce
      .number()
      .min(1, 'Le coefficient ne doit pas être inférieur ou égal à 0'),
    weeklyHours: z.coerce
      .number()
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

import { z } from 'zod';
import { Day } from '../core';
import { LessonStatus } from './enums.contract.ts';

export const LessonContract = z.object({
  id: z.cuid2().describe('Identifiant de la leçon'),
  title: z.string().nullish().describe('Titre optionnel de la leçon'),
  subtitle: z.string().nullish().describe('Sous-titre optionnel'),
  day: Day.describe('Jour de la semaine'),
  startTime: z
    .union([z.string(), z.coerce.date()])
    .describe('Heure de début (format @db.Time)'),
  endTime: z
    .union([z.string(), z.coerce.date()])
    .describe('Heure de fin (format @db.Time)'),
  date: z
    .union([z.string(), z.coerce.date()])
    .nullish()
    .describe('Date précise si la leçon est ponctuelle'),
  status: LessonStatus.default('PLANNED').describe('Statut de la leçon'),
  schoolId: z.uuid().describe('École de rattachement'),
  roomId: z.cuid2().nullish().describe('Salle utilisée'),
  teacherAssignmentId: z.cuid2().describe('Assignation enseignant concernée'),
  createdAt: z.coerce.date<Date>().describe('Date de création'),
  updatedAt: z.coerce
    .date<Date>()
    .nullish()
    .describe('Date de dernière mise à jour'),
  deletedAt: z.coerce
    .date<Date>()
    .nullish()
    .describe('Date de suppression logique'),
  room: z.any().nullish().describe('Salle'),
  assignments: z.any().optional().describe('Assignation enseignants.'),
  courseSessions: z
    .array(z.any())
    .optional()
    .describe('Sessions de cours associées'),
});

export type LessonContract = z.infer<typeof LessonContract>;

export const CreateLessonSchema = z
  .object({
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
    day: Day,
    status: LessonStatus.optional(),
    subjectId: z
      .string('Veuillez sélectionner une matière.')
      .min(1, 'Veuillez sélectionner une matière.'),
    teacherId: z.string().min(1, 'Veuillez sélectionner un enseignant.'),
    groupId: z.string().optional(),
    classId: z.string().optional(),
  })
  .refine(validateTimeRange, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['endTime'],
  })
  .refine(
    (data) => {
      // Si on est en mode CLASS, on doit avoir un enseignant sélectionné
      return !(data.mode === 'CLASS' && (!data.teacherId || !data.groupId));
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

export const UpdateLessonSchema = z.object({
  id: z.string(),
  mode: z.enum(['TEACHER', 'CLASS']).optional(),
  startTime: CreateLessonSchema.shape.startTime.optional(),
  endTime: CreateLessonSchema.shape.endTime.optional(),
  day: CreateLessonSchema.shape.day.optional(),
});

export type UpdateLessonSchema = z.infer<typeof UpdateLessonSchema>;

export type CreateLessonSchema = z.infer<typeof CreateLessonSchema>;

/**
 * Fonction utilitaire pour valider que l'heure de fin est après l'heure de début
 */
function validateTimeRange(data: { startTime: string; endTime: string }) {
  const [startH, startM] = data.startTime.split(':').map(Number);
  const [endH, endM] = data.endTime.split(':').map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM))
    return false;

  return endH > startH || (endH === startH && endM > startM);
}

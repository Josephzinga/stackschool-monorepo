import { z } from 'zod';
import { Day } from '../core';

export interface RawLessonEvent {
  id: string;
  teacherId: string;
  title: string;
  startTime: string;
  endTime: string;
  day: Day;
  status: LessonStatusEnum;
  subject: { id: string; name: string };
  group: { id: string; name: string } | null;
  room: { id: string; name: string } | null;
}
export enum LessonStatusEnum {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Ongoing = 'ONGOING',
  Planned = 'PLANNED',
  Postponed = 'POSTPONED',
}

export const CreateLessonSchema = z
  .object({
    id: z.cuid2().optional(),
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
    status: z.enum(LessonStatusEnum).optional(),
    subjectId: z
      .string('Veuillez sélectionner une matière.')
      .min(1, 'Veuillez sélectionner une matière.'),
    teacherId: z.string().min(1, 'Veuillez sélectionner un enseignant.'),
    groupId: z.cuid2().optional(),
    classId: z.cuid2().optional(),
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

export const UpdateLessonSchema = z.object({
  id: z.cuid2(),
  mode: z.enum(['TEACHER', 'CLASS']),
  startTime: CreateLessonSchema.shape.startTime.optional(),
  endTime: CreateLessonSchema.shape.endTime.optional(),
  day: CreateLessonSchema.shape.day.optional(),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
  groupId: z.string().optional(),
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

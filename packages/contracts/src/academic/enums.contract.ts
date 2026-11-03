import { z } from 'zod';

export const SubjectCategory = z.enum([
  'SCIENTIFIC',
  'LITERARY',
  'GENERAL',
  'SPORT',
]);
export type SubjectCategory = z.infer<typeof SubjectCategory>;

export const GroupType = z.enum(['SOLO', 'MULTIPLE']);
export type GroupType = z.infer<typeof GroupType>;

export const LessonStatus = z.enum([
  'PLANNED',
  'ONGOING',
  'COMPLETED',
  'CANCELLED',
  'POSTPONED',
]);
export type LessonStatus = z.infer<typeof LessonStatus>;

export const SessionStatus = z.enum(['FINISHED', 'STARTED']);
export type SessionStatus = z.infer<typeof SessionStatus>;

export const RoomType = z.enum([
  'CLASSROOM',
  'LECTURE_HALL',
  'COMPUTER_LAB',
  'LIBRARY',
  'STUDY_ROOM',
  'TEACHERS_ROOM',
  'ADMINISTRATIVE_OFFICE',
  'MEETING_ROOM',
  'EXAM_ROOM',
  'SPORTS_HALL',
  'GYM',
  'CANTEEN',
  'MEDICAL_ROOM',
  'STORAGE_ROOM',
  'MULTIPURPOSE_ROOM',
  'OTHER',
]);
export type RoomType = z.infer<typeof RoomType>;

export const AssessmentType = z.enum([
  'EXAM',
  'ASSIGNMENT',
  'QUIZ',
  'TEST',
  'PRACTICAL',
  'ORAL',
]);
export type AssessmentType = z.infer<typeof AssessmentType>;

export const AssessmentStatus = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']);
export type AssessmentStatus = z.infer<typeof AssessmentStatus>;

export const EventType = z.enum([
  'HOLIDAY',
  'MEETING',
  'EXAM',
  'ANNOUNCEMENT',
  'COURSE',
  'OTHER',
]);
export type EventType = z.infer<typeof EventType>;

export const EventAudience = z.enum([
  'ALL',
  'TEACHERS',
  'PARENTS',
  'STUDENTS',
  'STAFF',
]);
export type EventAudience = z.infer<typeof EventAudience>;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Champ DateTime Prisma accepté sous forme Date ou string ISO. */
const dateTime = z.coerce.date<Date>();

/** Champ DateTime @db.Time → chaîne "HH:mm:ss" ou Date. */
const timeOnly = z.union([z.string(), z.coerce.date<Date>()]);

/** Champ DateTime @db.Date → chaîne "YYYY-MM-DD" ou Date. */
const dateOnly = z.union([z.string(), z.coerce.date<Date>()]);

/** Champ JSON libre — remplacez par un schéma plus précis si connu. */
const jsonField = z.unknown();

/** Champ relationnel chargé — `z.any()` par défaut, à remplacer par le contrat. */
const relation = z.any();

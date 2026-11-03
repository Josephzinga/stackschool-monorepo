import { z } from 'zod';
import {
  AssessmentStatus,
  AssessmentType,
  EventAudience,
  EventType,
  GroupType,
  SessionStatus,
  SubjectCategory,
} from './enums.contract';
import { RoomContract } from './room.schema.ts';
import { LessonContract } from './lesson.contract.ts';

export const SubjectContract = z.object({
  id: z.cuid2().describe('Identifiant unique de la matière'),
  name: z.string().min(1).describe('Nom de la matière (unique par école)'),
  code: z.string().nullish().describe('Code court de la matière (ex : MATH)'),
  category: SubjectCategory.default('GENERAL').describe(
    'Catégorie pédagogique de la matière',
  ),
  mainTeacherId: z
    .cuid2()
    .nullish()
    .describe('Enseignant principal responsable de la matière'),
  schoolId: z.uuid().describe('École de rattachement'),
  createdAt: z.coerce.date<Date>().describe('Date de création'),
  updatedAt: z.coerce.date<Date>().describe('Date de dernière mise à jour'),
  deletedAt: z.coerce
    .date<Date>()
    .nullish()
    .describe('Date de suppression logique'),
  classSubjects: z
    .array(z.any())
    .optional()
    .describe('Pivots ClassSubjects associés'),
});

export type SubjectContract = z.infer<typeof SubjectContract>;

export const ClassSubjectContract = z.object({
  id: z.cuid2().describe('Identifiant du pivot ClassSubjects'),
  groupId: z.cuid2().describe('Groupe (classe) concerné'),
  schoolId: z.uuid().describe('École de rattachement'),
  weeklyHours: z
    .int()
    .nullish()
    .describe("Nombre d'heures hebdomadaires consacrées à cette matière"),
  coefficient: z
    .int()
    .min(1)
    .default(1)
    .describe('Coefficient de la matière pour le calcul des moyennes'),
  subjectId: z.cuid2().describe('Matière enseignée'),
  assessments: z
    .array(z.any())
    .optional()
    .describe('Évaluations rattachées à ce pivot'),
  group: z.any().optional().describe('Groupe parent'),
  subject: SubjectContract.describe('Matière parente').optional(),
  assignments: z.any().nullish().describe('Enseignant assigné (relation 1-1)'),
});

export type ClassSubjectContract = z.infer<typeof ClassSubjectContract>;

export const TeacherAssignmentContract = z.object({
  id: z.cuid2().describe("Identifiant de l'assignation"),
  teacherId: z.cuid2().describe('Enseignant assigné'),
  classSubjectId: z.cuid2().describe('Pivot ClassSubjects concerné'),
  schoolId: z.uuid().describe('École de rattachement'),
  classSubject: ClassSubjectContract.optional().describe('Pivot parent'),
  lessons: z.array(LessonContract).optional().describe('Leçons planifiées'),
});

export type TeacherAssignment = z.infer<typeof TeacherAssignmentContract>;

export const GroupContract = z.object({
  id: z.cuid2().describe('Identifiant du groupe'),
  name: z.string().min(1).describe('Nom du groupe (unique par école)'),
  type: GroupType.default('SOLO').describe(
    'SOLO = une seule classe, MULTIPLE = plusieurs classes mutualisées',
  ),
  schoolId: z.uuid().describe('École de rattachement'),
  deletedAt: z.coerce.date().nullish().describe('Date de suppression logique'),
  classes: z.array(z.any()).optional().describe('Classes rattachées'),
  classSubjects: z
    .array(z.any())
    .optional()
    .describe('Pivots ClassSubjects rattachés'),
});

export type GroupContract = z.infer<typeof GroupContract>;

export const ClassContract = z.object({
  id: z.cuid2().describe('Identifiant de la classe'),
  name: z.string().min(1).describe('Nom de la classe (unique par école)'),
  level: z.string().min(1).describe('Niveau scolaire (ex: 6ème, Terminale)'),
  section: z.string().nullish().describe('Section (ex: A, B, S, L)'),
  schoolId: z.uuid().describe('École de rattachement'),
  teacherId: z.cuid2().nullish().describe('Professeur principal'),
  defaultRoomId: z.cuid2().nullish().describe('Salle par défaut'),
  supervisorId: z.cuid2().nullish().describe('Surveillant référent'),
  groupId: z.cuid2().describe('Groupe parent'),
  createdAt: z.coerce.date<Date>().describe('Date de création'),
  updatedAt: z.coerce.date<Date>().describe('Date de dernière mise à jour'),
  deletedAt: z.coerce
    .date<Date>()
    .nullish()
    .describe('Date de suppression logique'),
  group: GroupContract.optional().describe('Groupe parent'),
  defaultRoom: RoomContract.nullish().describe('Salle par défaut'),
});

export type ClassContract = z.infer<typeof ClassContract>;

export const CourseSessionContract = z.object({
  id: z.cuid2().describe('Identifiant de la session'),
  lessonId: z.cuid2().describe('Leçon parente'),
  chapter: z.string().min(1).describe('Chapitre traité (ex: Algèbre)'),
  title: z
    .string()
    .min(1)
    .describe('Titre de la session (ex: Les équations du second degré)'),
  date: z.coerce.date().describe('Date de la session'),
  startTime: z
    .union([z.string(), z.coerce.date<Date>()])
    .describe('Heure de début'),
  endTime: z
    .union([z.string(), z.coerce.date<Date>()])
    .nullish()
    .describe('Heure de fin'),
  status: SessionStatus.default('STARTED').describe(
    'Statut de la session (STARTED / FINISHED)',
  ),
  lesson: LessonContract.optional().describe('Leçon parente'),
});

export type CourseSessionContract = z.infer<typeof CourseSessionContract>;

export const AssessmentResultContract = z.object({
  id: z.cuid2().describe('Identifiant du résultat'),
  assessmentId: z.cuid2().describe('Évaluation parente'),
  studentId: z.cuid2().describe('Élève concerné'),
  score: z.number().nullish().describe('Note obtenue'),
  grade: z.string().nullish().describe('Appréciation / mention'),
  feedback: z.string().nullish().describe('Commentaire détaillé'),
  status: z.string().nullish().describe('Statut (ex: SUBMITTED, GRADED)'),
  submittedAt: z.coerce.date<Date>().nullish().describe('Date de soumission'),
  gradedAt: z.coerce.date<Date>().nullish().describe('Date de notation'),
  createdAt: z.coerce.date<Date>().describe('Date de création'),
  updatedAt: z.coerce.date<Date>().describe('Date de dernière mise à jour'),
  deletedAt: z.coerce
    .date<Date>()
    .nullish()
    .describe('Date de suppression logique'),
  assessment: z.any().optional().describe('Évaluation parente'),
});

export type AssessmentResultContract = z.infer<typeof AssessmentResultContract>;

export const AssessmentContract = z.object({
  id: z.cuid2().describe("Identifiant de l'évaluation"),
  title: z.string().min(1).describe("Titre de l'évaluation"),
  type: AssessmentType.describe("Type d'évaluation"),
  description: z.string().nullish().describe('Description détaillée'),
  status: AssessmentStatus.default('DRAFT').describe('Statut de publication'),
  weight: z
    .number()
    .nonnegative()
    .nullish()
    .describe('Poids relatif dans la moyenne'),
  maxScore: z.number().positive().describe('Note maximale possible'),
  teacherId: z.cuid2().describe('Enseignant créateur'),
  classSubjectId: z.cuid2().describe('Pivot ClassSubjects concerné'),
  schoolId: z.uuid().describe('École de rattachement'),
  startDate: z.coerce.date<Date>().nullish().describe('Date de début'),
  endDate: z
    .union([z.string(), z.coerce.date<Date>()])
    .nullish()
    .describe('Date de fin (@db.Date)'),
  dueDate: z
    .union([z.string(), z.coerce.date<Date>()])
    .nullish()
    .describe('Date de remise (@db.Date)'),
  createdAt: z.coerce.date().describe('Date de création'),
  updatedAt: z.coerce.date().describe('Date de dernière mise à jour'),
  classSubject: z.any().optional().describe('Pivot parent'),
  results: z
    .array(AssessmentResultContract)
    .optional()
    .describe('Résultats des élèves'),
});

export type AssessmentContract = z.infer<typeof AssessmentContract>;

export const EventContract = z.object({
  id: z.cuid2().describe("Identifiant de l'événement"),
  schoolId: z.uuid().describe('École de rattachement'),
  title: z.string().min(1).describe("Titre de l'événement"),
  description: z.string().nullish().describe('Description détaillée'),
  type: EventType.default('OTHER').describe("Type d'événement"),
  audience: EventAudience.default('ALL').describe(
    "Public cible de l'événement",
  ),
  startAt: z.coerce.date<Date>().describe('Date et heure de début'),
  endAt: z.coerce.date<Date>().nullish().describe('Date et heure de fin'),
  allDay: z.boolean().default(true).describe('Événement sur toute la journée'),
  location: z.string().nullish().describe("Lieu de l'événement"),
  color: z
    .string()
    .nullish()
    .describe('Couleur personnalisée (fallback sur la couleur du type)'),
  createdById: z.uuid().describe('Utilisateur créateur'),
  createdAt: z.coerce.date<Date>().describe('Date de création'),
  updatedAt: z.coerce.date<Date>().describe('Date de dernière mise à jour'),
});

/* Dérivés utiles pour les mutations */
export const CreateEventContract = EventContract.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateEventContract = CreateEventContract.partial();

export type EventContract = z.infer<typeof EventContract>;
export type CreateEvent = z.infer<typeof CreateEventContract>;
export type UpdateEvent = z.infer<typeof UpdateEventContract>;

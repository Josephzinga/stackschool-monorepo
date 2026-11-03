import z from 'zod';
import { RoomType } from './enums.contract.ts';

export const RoomContract = z.object({
  id: z.cuid2().describe('Identifiant de la salle'),
  name: z.string().min(1).describe('Nom de la salle (unique par école)'),
  code: z.string().nullish().describe('Code court de la salle (ex: A101)'),
  type: RoomType.nullish()
    .default('CLASSROOM')
    .describe("Type d'usage de la salle"),
  capacity: z
    .int()
    .positive()
    .nullish()
    .describe("Capacité maximale d'accueil"),
  schoolId: z.uuid().describe('École de rattachement'),
  deletedAt: z.coerce.date().nullish().describe('Date de suppression logique'),
  defaultForClass: z
    .any()
    .nullish()
    .describe("Classe dont c'est la salle par défaut"),
  lessons: z.array(z.any()).optional().describe('Leçons planifiées ici'),
});

export type Room = z.infer<typeof RoomContract>;

export const CreateRoomSchema = z.object({
  name: z.string().min(1, 'Le nom de la salle est requise.'),
  capacity: z.coerce
    .number<number>()
    .min(1, 'Le nombre de places doit être superieur à 1.')
    .optional(),
  type: RoomType,
  defaultClassId: z.cuid2().optional(),
  code: z.string(),
});

export const UpdateRoomSchema = z.object({
  id: z.cuid2(),
  name: z.string().optional(),
  capacity: CreateRoomSchema.shape.capacity,
  type: RoomType.optional(),
  defaultClassId: z.string().optional(),
  code: z.string().optional(),
});
export type UpdateRoomSchema = z.infer<typeof UpdateRoomSchema>;
export type CreateRoomSchema = z.infer<typeof CreateRoomSchema>;

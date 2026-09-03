import z from 'zod';

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
export const CreateRoomSchema = z.object({
  name: z.string().min(1, 'Le nom de la salle est requise.'),
  capacity: z.coerce
    .number<number>()
    .min(1, 'Le nombre de place doit être superieur à 1')
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

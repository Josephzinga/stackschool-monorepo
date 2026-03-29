import z from 'zod';

export const createRoomSchema = z.object({
  id: z.cuid().optional(),
  name: z.string().min(1, 'Le nom de la salle est requise.'),
  capacity: z.coerce
    .number()
    .min(1, 'Le nombre de place doit être superieur à 1')
    .optional(),
  type: z.string().optional(),
  defaultClassId: z.cuid().optional(),
  code: z.string().optional(),
});
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;

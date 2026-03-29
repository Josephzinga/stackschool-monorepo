import { z } from '@stackschool/shared';

export const uploadedImageSchema = z.object({
  file: z.object({
    mimetype: z
      .string()
      .refine(
        (v) =>
          ['image/jpeg', 'image/png', 'image/webp', 'image/svg'].includes(v),
        {
          message: 'Format invalide (jpeg, png, webp, svg)',
        },
      ),
    size: z
      .number()
      .max(5 * 1024 * 1024, { message: 'La taille maximale est de 5MB' }),
    filename: z.string(),
  }),
  body: z.object({
    isOncompleteProfile: z.boolean().optional(),
    profileId: z.cuid(),
  }),
});

import { z } from "@stackschool/shared";

export const uploadedImageSchema = z.object({
  mimetype: z
    .string()
    .refine(
      (v) => ["image/jpeg", "image/png", "image/webp", "image/svg"].includes(v),
      {
        message: "Format invalide (jpeg, png, webp, svg)",
      }
    ),
  size: z.number().max(5 * 1024 * 1024, { message: "Taille max 5MB" }),
  filename: z.string(),
});

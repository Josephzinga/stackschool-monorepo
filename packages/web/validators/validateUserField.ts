import api from "@/services/api";
import { z } from "@stackschool/shared";

export const validateUserFieldSchema = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().min(8, "Numéro invalide").optional(),
  })
  .superRefine(async (data, ctx) => {
    const params = new URLSearchParams(data);
  });

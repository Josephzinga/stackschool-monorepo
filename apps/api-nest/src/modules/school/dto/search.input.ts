import { z } from 'zod';

export const searchSchoolSchema = z.object({
  searchTerm: z
    .string()
    .trim()
    .min(2, 'Le terme de recherche dois contenir au moins 2 càractères.'),
});

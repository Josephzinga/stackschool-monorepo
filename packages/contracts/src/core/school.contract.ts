import { z } from 'zod';

export const SchoolContract = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  address: z.string(),
  logo: z.string().nullable(),
  slug: z.string().nullable(),
  createdAt: z.coerce.date<Date>().optional(),
});
export type SchoolContract = z.infer<typeof SchoolContract>;

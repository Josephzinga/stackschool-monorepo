import { z } from 'zod';

export const SchoolContract = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  address: z.string(),
  logo: z.string().optional(),
  slug: z.string().nullish(),
  createdAt: z.coerce.date<Date>().optional(),
});
export type SchoolContract = z.infer<typeof SchoolContract>;

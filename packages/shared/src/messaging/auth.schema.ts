// packages/shared/src/messaging/auth.schemas.ts
import { z } from 'zod';
import { loginFormSchema, profileSchema } from '../validation/auth.schema.ts';

export const ValidateCredentialsInput = loginFormSchema;
export type ValidateCredentialsInput = z.infer<typeof ValidateCredentialsInput>;

export const ValidateCredentialsOutput = z
  .object({
    id: z.uuid(),
    email: z.email(),
    username: z.string(),
    profile: z
      .object({
        firstname: z.string(),
        lastname: z.string(),
        photo: z.string().nullable(),
      })
      .nullable(),
  })
  .nullable();
export type ValidateCredentialsOutput = z.infer<
  typeof ValidateCredentialsOutput
>;

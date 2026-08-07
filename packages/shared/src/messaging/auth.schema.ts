import {z} from 'zod';
import {forgotPasswordSchema, loginFormSchema,} from '@stackschool/messaging';
import {UserWithRelationsContract} from '../contracts/user.contract.ts';

export const ValidateCredentialsInput = loginFormSchema;
export type ValidateCredentialsInput = z.infer<typeof ValidateCredentialsInput>;

const ok = z.boolean().default(false);

export const ForgotPassword = forgotPasswordSchema;

export const resetPasswordInput = z.object({
  token: z.string().nullable(),
  password: z.string(),
  tempToken: z.string().nullable(),
});

export const createUserSessionInput = z.object({
  userId: z.string(),
});

export const refreshTokenInput = z.object({
  refreshToken: z.string(),
});

export const refreshTokenResponse = z.object({
  ok,
  user: UserWithRelationsContract,
});

export const createUserSessionResponse = z.object({
  id: z.string(),
  userId: z.string(),
  sessionToken: z.string(),
  expires: z.coerce.string<string>(),
});

export const resetPasswordResponse = z.object({
  ok: z.boolean().default(false),
  message: z.string(),
});

export const forgotPasswordResponse = z.object({
  ok: z.boolean().default(false),
  message: z.string(),
  tempToken: z.string().optional(),
  method: z.literal(['whatsapp', 'email']).optional(),
  expires: z.string().optional(),
});

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
export type ResetPasswordInput = z.infer<typeof resetPasswordInput>;
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponse>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponse>;
export type CreateUserSessionResponse = z.infer<
  typeof createUserSessionResponse
>;
export type CreateUserSessionInput = z.infer<typeof createUserSessionInput>;
export type FindFullUserInput = z.infer<typeof findFullUserInput>;
export type RefreshTokenInput = z.infer<typeof refreshTokenInput>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponse>;

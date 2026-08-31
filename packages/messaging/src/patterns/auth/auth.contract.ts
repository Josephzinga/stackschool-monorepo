import { z } from 'zod';
import {
  forgotPasswordSchema,
  loginFormSchema,
  profileSchema,
  registerFormSchema,
  UserWithRelationsContract,
} from '@stackschool/contracts';

export const ValidateCredentialsInput = loginFormSchema;
export type ValidateCredentialsInput = z.infer<typeof ValidateCredentialsInput>;

const ok = z.boolean().default(false);
const message = z.string();

export const forgotPasswordInput = forgotPasswordSchema;
export const createUserInput = z.object({
  email: registerFormSchema.shape.email.optional(),
  phoneNumber: registerFormSchema.shape.phoneNumber.optional(),
  password: registerFormSchema.shape.password.optional(),
  confirm: registerFormSchema.shape.confirm.optional(),
  isActive: z.boolean().default(true),
  username: z.string(),
});

export const resetPasswordInput = z.object({
  token: z.string().optional(),
  password: z.string(),
  resetToken: z.string().optional(),
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

export const verifyCodeInput = z.object({
  code: z.string(),
  tempToken: z.string(),
});

export const verifyCodeResponse = z.object({
  ok,
  message,
  resetAccessToken: z.string(),
});

export const findFullUserInput = createUserSessionInput;

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
        firstName: z.string(),
        lastName: z.string(),
        photo: z.string().nullable(),
      })
      .nullable(),
  })
  .nullable();

export const UpdateProfileInput = z.object({
  userId: z.uuid(),
  profileData: profileSchema,
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInput>;

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
export type CreateUserInput = z.infer<typeof createUserInput>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>;
export type VerifyCodeResponse = z.infer<typeof verifyCodeResponse>;
export type VerifyCodeInput = z.infer<typeof verifyCodeInput>;

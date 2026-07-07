import {
  loginFormSchema,
  registerFormSchema,
  resetPasswordSchema,
  VerifyCodeSchema,
} from '@stackschool/shared';
import { z } from 'zod';

export const extendedResetPasswordSchema = resetPasswordSchema.extend({
  token: z.string('Le token de vérification est requis.'),
});

export type LoginDto = z.infer<typeof loginFormSchema>;

export type RegisterDto = z.infer<typeof registerFormSchema>;

export type ResetPasswordDto = z.infer<typeof extendedResetPasswordSchema>;

export type VerifyCodeDto = z.infer<typeof VerifyCodeSchema>;

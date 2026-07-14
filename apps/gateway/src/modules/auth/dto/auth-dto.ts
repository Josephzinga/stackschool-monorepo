import {
  loginFormSchema,
  registerFormSchema,
  resetPasswordSchema,
  VerifyCodeSchema,
} from '@stackschool/contracts';
import { z } from 'zod';

export type LoginDto = z.infer<typeof loginFormSchema>;

export type RegisterDto = z.infer<typeof registerFormSchema>;

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export type VerifyCodeDto = z.infer<typeof VerifyCodeSchema>;

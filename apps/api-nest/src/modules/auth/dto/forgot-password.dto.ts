import { forgotPasswordSchema } from '@stackschool/shared';
import { z } from 'zod';

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

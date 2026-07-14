import { forgotPasswordSchema } from '@stackschool/contracts';
import { z } from 'zod';

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

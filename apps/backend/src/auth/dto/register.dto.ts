import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerFormSchema = z.object({
  email: z.email(),
  username: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export class RegisterDto extends createZodDto(registerFormSchema) {}

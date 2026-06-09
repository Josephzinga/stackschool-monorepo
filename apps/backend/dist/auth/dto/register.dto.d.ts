import { z } from 'zod';
declare const RegisterDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodEmail;
    username: z.ZodString;
    phoneNumber: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>, false>;
export declare class RegisterDto extends RegisterDto_base {
}
export {};

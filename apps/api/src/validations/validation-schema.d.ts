import { z } from '@stackschool/shared';
export declare const resetPasswordApiSchema: z.ZodObject<{
    token: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, z.core.$strip>;
export declare const validateUserFieldSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    selfCheck: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=validation-schema.d.ts.map
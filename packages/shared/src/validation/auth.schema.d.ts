import * as z from 'zod';
export declare enum GenderEnum {
    Female = "FEMALE",
    Male = "MALE"
}
export declare const loginFormSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerFormSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    confirm: z.ZodString;
}, z.core.$strip>;
export declare const VerifyCodeSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    identifier: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
    confirm: z.ZodString;
}, z.core.$strip>;
export declare const profileSchema: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    gender: z.ZodEnum<typeof GenderEnum>;
    photo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type ProfileType = z.infer<typeof profileSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type FormDataType = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeFormType = z.infer<typeof VerifyCodeSchema>;
export type RegisterFormType = z.infer<typeof registerFormSchema>;
export type LoginFormType = z.infer<typeof loginFormSchema>;
//# sourceMappingURL=auth.schema.d.ts.map
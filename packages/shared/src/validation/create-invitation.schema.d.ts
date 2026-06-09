import { z } from 'zod';
export declare const createInvitationSchema: z.ZodObject<{
    schoolId: z.ZodString;
    role: z.ZodEnum<{
        PARENT: "PARENT";
        ADMIN: "ADMIN";
        TEACHER: "TEACHER";
        STUDENT: "STUDENT";
        STAFF: "STAFF";
    }>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    message: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateInvitationData = z.infer<typeof createInvitationSchema>;
//# sourceMappingURL=create-invitation.schema.d.ts.map
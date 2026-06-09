import { z } from 'zod';
export declare const createTeacherSchema: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    gender: z.ZodEnum<typeof import("./auth.schema").GenderEnum>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    diploma: z.ZodString;
    specialization: z.ZodString;
}, z.core.$strip>;
export declare const classSubjectAssignmentSchema: z.ZodObject<{
    classId: z.ZodCUID;
    subjectIds: z.ZodArray<z.ZodCUID>;
}, z.core.$strip>;
export declare const teacherAssignmentSchema: z.ZodObject<{
    classId: z.ZodCUID;
    subjectIds: z.ZodArray<z.ZodCUID>;
    teacherId: z.ZodCUID;
}, z.core.$strip>;
export type TeacherAssignmentFormData = z.infer<typeof teacherAssignmentSchema>;
export type CreateTeacherValues = z.infer<typeof createTeacherSchema>;
export type ClassSubjectAssignment = z.infer<typeof classSubjectAssignmentSchema>;
//# sourceMappingURL=create-list-teacher.schema.d.ts.map
import z from 'zod';
export declare enum LessonStatusEnum {
    Cancelled = "CANCELLED",
    Completed = "COMPLETED",
    Ongoing = "ONGOING",
    Planned = "PLANNED",
    Postponed = "POSTPONED"
}
declare enum SubjectCategory {
    General = "GENERAL",
    Literary = "LITERARY",
    Scientific = "SCIENTIFIC",
    Sport = "SPORT"
}
export declare const createLessonSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodCUID>;
    mode: z.ZodEnum<{
        TEACHER: "TEACHER";
        CLASS: "CLASS";
    }>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    day: z.ZodEnum<{
        MONDAY: "MONDAY";
        TUESDAY: "TUESDAY";
        WEDNESDAY: "WEDNESDAY";
        THURSDAY: "THURSDAY";
        FRIDAY: "FRIDAY";
        SATURDAY: "SATURDAY";
    }>;
    status: z.ZodOptional<z.ZodEnum<typeof LessonStatusEnum>>;
    subjectId: z.ZodString;
    teacherId: z.ZodString;
    groupId: z.ZodOptional<z.ZodCUID>;
    classId: z.ZodOptional<z.ZodCUID>;
}, z.core.$strip>;
export declare const updateLessonSchema: z.ZodObject<{
    id: z.ZodCUID;
    mode: z.ZodEnum<{
        TEACHER: "TEACHER";
        CLASS: "CLASS";
    }>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    day: z.ZodOptional<z.ZodEnum<{
        MONDAY: "MONDAY";
        TUESDAY: "TUESDAY";
        WEDNESDAY: "WEDNESDAY";
        THURSDAY: "THURSDAY";
        FRIDAY: "FRIDAY";
        SATURDAY: "SATURDAY";
    }>>;
    subjectId: z.ZodOptional<z.ZodString>;
    teacherId: z.ZodOptional<z.ZodString>;
    groupId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateLessonFormData = z.infer<typeof updateLessonSchema>;
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;
export declare const createSubjectForm: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    mainTeacherId: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<typeof SubjectCategory>;
    classSubject: z.ZodOptional<z.ZodArray<z.ZodObject<{
        classId: z.ZodString;
        coefficient: z.ZodNumber;
        weeklyHours: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateSubjectForm = z.infer<typeof createSubjectForm>;
export declare const createClassSubjectSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodCUID>;
    teacherId: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodCUID;
    coefficient: z.ZodCoercedNumber<unknown>;
    weeklyHours: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateClassSubjectFormData = z.infer<typeof createClassSubjectSchema>;
export {};
//# sourceMappingURL=subject-list.schema.d.ts.map
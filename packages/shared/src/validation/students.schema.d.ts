import { z } from 'zod';
import { RelationTypeEnum } from './complete-profile.schema';
export declare enum StudentStatusEnum {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    EXPELLED = "EXPELLED",
    TRANSFERRED = "TRANSFERRED",
    DROPPED_OUT = "DROPPED_OUT",
    GRADUATED = "GRADUATED",
    INACTIVE = "INACTIVE",
    DECEASED = "DECEASED"
}
export declare enum TransportModeEnum {
    BUS = "BUS",
    WALK = "WALK",
    PARENT = "PARENT",
    MOTO = "MOTO",
    OTHER = "OTHER"
}
export declare const searchStudentSchema: z.ZodObject<{
    schoolId: z.ZodCUID;
}, z.core.$strip>;
export declare const createStudentSchema: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    gender: z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>;
    address: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>>;
    username: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<typeof StudentStatusEnum>>;
    birthCertificateNumber: z.ZodOptional<z.ZodString>;
    previousSchool: z.ZodOptional<z.ZodString>;
    previousClass: z.ZodOptional<z.ZodString>;
    studentNumber: z.ZodOptional<z.ZodNumber>;
    enrollmentDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    transportMode: z.ZodOptional<z.ZodEnum<typeof TransportModeEnum>>;
    documents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>>;
    birthDate: z.ZodCoercedDate<unknown>;
    birthPlace: z.ZodOptional<z.ZodString>;
    matricule: z.ZodString;
    classId: z.ZodString;
    enrollmentYear: z.ZodString;
    parentData: z.ZodObject<{
        mode: z.ZodEnum<{
            CONNECT: "CONNECT";
            CREATE: "CREATE";
        }>;
        parentId: z.ZodOptional<z.ZodCUID>;
        newParent: z.ZodOptional<z.ZodObject<{
            firstname: z.ZodNonOptional<z.ZodString>;
            lastname: z.ZodNonOptional<z.ZodString>;
            address: z.ZodString;
            phoneNumber: z.ZodNonOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
            email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>>;
            gender: z.ZodOptional<z.ZodEnum<typeof import("./auth.schema").GenderEnum>>;
            relationType: z.ZodEnum<typeof RelationTypeEnum>;
            profession: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    nationality: z.ZodString;
    bloodGroup: z.ZodOptional<z.ZodString>;
    allergies: z.ZodOptional<z.ZodString>;
    medicalCondition: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateStudentValues = z.infer<typeof createStudentSchema>;
export type SearchStudentParams = z.infer<typeof searchStudentSchema>;
//# sourceMappingURL=students.schema.d.ts.map
import { z } from 'zod';
import { profileSchema } from '../../src';
export declare enum RelationTypeEnum {
    FATHER = "FATHER",
    MOTHER = "MOTHER",
    GRAND_FATHER = "GRAND_FATHER",
    GRAND_MOTHER = "GRAND_MOTHER",
    UNCLE = "UNCLE",
    AUNT = "AUNT",
    OTHER = "OTHER",
    GUARDIAN = "GUARDIAN"
}
export declare const createSchoolSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
export declare const schoolSelectedSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodString;
    logo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const schoolDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"create">;
    newSchool: z.ZodObject<{
        name: z.ZodString;
        address: z.ZodString;
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"join">;
    schoolSelected: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        code: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        address: z.ZodString;
        logo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"invite">;
    schoolId: z.ZodString;
    invitationCode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
export declare const ACADEMIC_YEAR_REGEX: RegExp;
export declare const studentFormSchema: z.ZodObject<{
    matricule: z.ZodString;
    birthDate: z.ZodCoercedDate<unknown>;
    classId: z.ZodCUID;
    enrollmentYear: z.ZodString;
    fatherName: z.ZodOptional<z.ZodString>;
    motherName: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
    birthPlace: z.ZodString;
}, z.core.$strip>;
export declare const parentFormSchema: z.ZodObject<{
    children: z.ZodArray<z.ZodObject<{
        id: z.ZodCUID;
        firstname: z.ZodString;
        lastname: z.ZodString;
        photo: z.ZodOptional<z.ZodString>;
        relation: z.ZodEnum<typeof RelationTypeEnum>;
    }, z.core.$strip>>;
    contactPreference: z.ZodEnum<{
        WHATSAPP: "WHATSAPP";
        PHONE: "PHONE";
        EMAIL: "EMAIL";
    }>;
    profession: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const invitationSchema: z.ZodObject<{
    invitationCode: z.ZodString;
}, z.core.$strip>;
export declare const teacherSchema: z.ZodObject<{
    diploma: z.ZodString;
    department: z.ZodOptional<z.ZodString>;
    assignments: z.ZodArray<z.ZodObject<{
        classId: z.ZodString;
        isMainTeacher: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        subjectIds: z.ZodArray<z.ZodString>;
        className: z.ZodOptional<z.ZodString>;
        subjectNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const StaffFormSchema: z.ZodObject<{
    position: z.ZodString;
    departement: z.ZodString;
    hireDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const roleDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    role: z.ZodLiteral<"STUDENT">;
    student: z.ZodObject<{
        matricule: z.ZodString;
        birthDate: z.ZodCoercedDate<unknown>;
        classId: z.ZodCUID;
        enrollmentYear: z.ZodString;
        fatherName: z.ZodOptional<z.ZodString>;
        motherName: z.ZodOptional<z.ZodString>;
        nationality: z.ZodOptional<z.ZodString>;
        birthPlace: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"PARENT">;
    parent: z.ZodObject<{
        children: z.ZodArray<z.ZodObject<{
            id: z.ZodCUID;
            firstname: z.ZodString;
            lastname: z.ZodString;
            photo: z.ZodOptional<z.ZodString>;
            relation: z.ZodEnum<typeof RelationTypeEnum>;
        }, z.core.$strip>>;
        contactPreference: z.ZodEnum<{
            WHATSAPP: "WHATSAPP";
            PHONE: "PHONE";
            EMAIL: "EMAIL";
        }>;
        profession: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"TEACHER">;
    teacher: z.ZodObject<{
        diploma: z.ZodString;
        department: z.ZodOptional<z.ZodString>;
        assignments: z.ZodArray<z.ZodObject<{
            classId: z.ZodString;
            isMainTeacher: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
            subjectIds: z.ZodArray<z.ZodString>;
            className: z.ZodOptional<z.ZodString>;
            subjectNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"STAFF">;
    staff: z.ZodObject<{
        position: z.ZodString;
        departement: z.ZodString;
        hireDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    role: z.ZodLiteral<"ADMIN">;
    admin: z.ZodObject<{
        position: z.ZodString;
        departement: z.ZodString;
        hireDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>], "role">;
export type StaffFormDataType = z.infer<typeof StaffFormSchema>;
export type InvitationFormData = z.infer<typeof invitationSchema>;
export type CreateSchoolType = z.infer<typeof createSchoolSchema>;
export type StudentFormDataType = z.infer<typeof studentFormSchema>;
export type ParentFormDataType = z.infer<typeof parentFormSchema>;
export type TeacherFormDataType = z.infer<typeof teacherSchema>;
export type ProfileFormDataType = z.infer<typeof profileSchema>;
export type SchoolDataType = z.infer<typeof schoolDataSchema>;
export type RoleDataType = z.infer<typeof roleDataSchema>;
//# sourceMappingURL=complete-profile.schema.d.ts.map
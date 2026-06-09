"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleDataSchema = exports.StaffFormSchema = exports.teacherSchema = exports.invitationSchema = exports.parentFormSchema = exports.studentFormSchema = exports.ACADEMIC_YEAR_REGEX = exports.schoolDataSchema = exports.schoolSelectedSchema = exports.createSchoolSchema = exports.RelationTypeEnum = void 0;
const zod_1 = require("zod");
zod_1.z.config(zod_1.z.locales.fr());
var RelationTypeEnum;
(function (RelationTypeEnum) {
    RelationTypeEnum["FATHER"] = "FATHER";
    RelationTypeEnum["MOTHER"] = "MOTHER";
    RelationTypeEnum["GRAND_FATHER"] = "GRAND_FATHER";
    RelationTypeEnum["GRAND_MOTHER"] = "GRAND_MOTHER";
    RelationTypeEnum["UNCLE"] = "UNCLE";
    RelationTypeEnum["AUNT"] = "AUNT";
    RelationTypeEnum["OTHER"] = "OTHER";
    RelationTypeEnum["GUARDIAN"] = "GUARDIAN";
})(RelationTypeEnum || (exports.RelationTypeEnum = RelationTypeEnum = {}));
exports.createSchoolSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Le nom de l'école doit contenir au moins 3 caractères")
        .max(100, 'Le nom est trop long'),
    address: zod_1.z
        .string()
        .min(5, "L'adresse doit être plus précise")
        .max(200, "L'adresse est trop longue"),
    code: zod_1.z.string().length(6, 'Le code doit contenir 6 caractères'),
});
exports.schoolSelectedSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    code: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string(),
    logo: zod_1.z.string().optional().nullable(),
});
exports.schoolDataSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('create'),
        newSchool: exports.createSchoolSchema,
    }),
    zod_1.z.object({
        type: zod_1.z.literal('join'),
        schoolSelected: exports.schoolSelectedSchema,
    }),
    zod_1.z.object({
        type: zod_1.z.literal('invite'),
        schoolId: zod_1.z.string(),
        invitationCode: zod_1.z.string().optional(),
    }),
]);
exports.ACADEMIC_YEAR_REGEX = /^(20\d{2})-(20\d{2})$/;
exports.studentFormSchema = zod_1.z.object({
    matricule: zod_1.z.string().min(1, 'Le matricule est requis'),
    birthDate: zod_1.z.coerce.date({
        error: ({ input }) => input === undefined
            ? 'Date de naissance requis'
            : 'Date de naissance invalide',
    }),
    classId: zod_1.z.cuid('Id invalide'),
    enrollmentYear: zod_1.z
        .string()
        .regex(exports.ACADEMIC_YEAR_REGEX)
        .refine((value) => {
        const [start, end] = value.split('-').map(Number);
        const current = new Date().getFullYear();
        return end === start + 1 && start >= 2000 && end <= current + 1;
    }, { message: "Année d'inscription invalide" }),
    fatherName: zod_1.z.string().min(3, 'Le nom du père est requis').optional(),
    motherName: zod_1.z.string().min(3, 'Le nom de la mère est requis').optional(),
    nationality: zod_1.z.string().optional(),
    birthPlace: zod_1.z.string().min(2, 'Le lieu de naissance est requis'),
});
exports.parentFormSchema = zod_1.z.object({
    children: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.cuid(),
        firstname: zod_1.z.string(),
        lastname: zod_1.z.string(),
        photo: zod_1.z.string().optional(),
        relation: zod_1.z.enum(RelationTypeEnum),
    }))
        .min(1, 'Veuillez sélectionner au moins un enfant.'),
    contactPreference: zod_1.z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
    profession: zod_1.z
        .string()
        .min(3, 'Veuillez entrer une profession valide')
        .optional(),
});
exports.invitationSchema = zod_1.z.object({
    invitationCode: zod_1.z
        .string()
        .min(5, "Le code d'invitation doit contenir au moins 6 lettres"),
});
exports.teacherSchema = zod_1.z.object({
    diploma: zod_1.z.string().min(2, 'Le diplôme est requis'),
    department: zod_1.z.string().optional(),
    assignments: zod_1.z
        .array(zod_1.z.object({
        classId: zod_1.z.string(),
        isMainTeacher: zod_1.z.boolean().default(false).optional(),
        subjectIds: zod_1.z
            .array(zod_1.z.string())
            .min(1, 'Sélectionnez au moins une matière'),
        className: zod_1.z.string().optional(),
        subjectNames: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .min(1, 'Veuillez sélectionner au moins une classe'),
});
exports.StaffFormSchema = zod_1.z.object({
    position: zod_1.z.string().min(2, 'Le poste est requis'),
    departement: zod_1.z.string().min(2, 'Le département est requis'),
    hireDate: zod_1.z.coerce.date().optional(),
});
exports.roleDataSchema = zod_1.z.discriminatedUnion('role', [
    zod_1.z.object({
        role: zod_1.z.literal('STUDENT'),
        student: exports.studentFormSchema,
    }),
    zod_1.z.object({
        role: zod_1.z.literal('PARENT'),
        parent: exports.parentFormSchema,
    }),
    zod_1.z.object({
        role: zod_1.z.literal('TEACHER'),
        teacher: exports.teacherSchema,
    }),
    zod_1.z.object({
        role: zod_1.z.literal('STAFF'),
        staff: exports.StaffFormSchema,
    }),
    zod_1.z.object({
        role: zod_1.z.literal('ADMIN'),
        admin: exports.StaffFormSchema,
    }),
]);
//# sourceMappingURL=complete-profile.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentSchema = exports.searchStudentSchema = exports.TransportModeEnum = exports.StudentStatusEnum = void 0;
const zod_1 = require("zod");
const complete_profile_schema_1 = require("./complete-profile.schema");
const auth_schema_1 = require("./auth.schema");
var StudentStatusEnum;
(function (StudentStatusEnum) {
    StudentStatusEnum["ACTIVE"] = "ACTIVE";
    StudentStatusEnum["SUSPENDED"] = "SUSPENDED";
    StudentStatusEnum["EXPELLED"] = "EXPELLED";
    StudentStatusEnum["TRANSFERRED"] = "TRANSFERRED";
    StudentStatusEnum["DROPPED_OUT"] = "DROPPED_OUT";
    StudentStatusEnum["GRADUATED"] = "GRADUATED";
    StudentStatusEnum["INACTIVE"] = "INACTIVE";
    StudentStatusEnum["DECEASED"] = "DECEASED";
})(StudentStatusEnum || (exports.StudentStatusEnum = StudentStatusEnum = {}));
var TransportModeEnum;
(function (TransportModeEnum) {
    TransportModeEnum["BUS"] = "BUS";
    TransportModeEnum["WALK"] = "WALK";
    TransportModeEnum["PARENT"] = "PARENT";
    TransportModeEnum["MOTO"] = "MOTO";
    TransportModeEnum["OTHER"] = "OTHER";
})(TransportModeEnum || (exports.TransportModeEnum = TransportModeEnum = {}));
exports.searchStudentSchema = zod_1.z.object({
    schoolId: zod_1.z.cuid().min(1, "L'identifiant de l'école est requis"),
});
exports.createStudentSchema = zod_1.z.object({
    firstname: zod_1.z.string().min(2, 'Le prénom est requis'),
    lastname: zod_1.z.string().min(2, 'Le nom est requis'),
    gender: zod_1.z.enum(['MALE', 'FEMALE']),
    address: zod_1.z.string().min(3, 'Veuillez entré une adresse valide').optional(),
    email: auth_schema_1.registerFormSchema.shape.email.optional(),
    username: auth_schema_1.registerFormSchema.shape.username.optional(),
    phoneNumber: auth_schema_1.registerFormSchema.shape.phoneNumber.optional(),
    isActive: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(StudentStatusEnum).optional(),
    birthCertificateNumber: zod_1.z.string().optional(),
    previousSchool: zod_1.z.string().optional(),
    previousClass: zod_1.z.string().optional(),
    studentNumber: zod_1.z.number().optional(),
    enrollmentDate: zod_1.z.coerce.date().optional(),
    transportMode: zod_1.z.enum(TransportModeEnum).optional(),
    documents: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        url: zod_1.z.string(),
    }))
        .optional(),
    birthDate: complete_profile_schema_1.studentFormSchema.shape.birthDate,
    birthPlace: complete_profile_schema_1.studentFormSchema.shape.birthPlace.optional(),
    matricule: complete_profile_schema_1.studentFormSchema.shape.matricule,
    classId: zod_1.z.string().min(1, 'La classe est requise'),
    enrollmentYear: complete_profile_schema_1.studentFormSchema.shape.enrollmentYear,
    parentData: zod_1.z.object({
        mode: zod_1.z.enum(['CONNECT', 'CREATE']),
        parentId: zod_1.z.cuid().optional(),
        newParent: zod_1.z
            .object({
            firstname: auth_schema_1.profileSchema.shape.firstname.nonoptional(),
            lastname: auth_schema_1.profileSchema.shape.lastname.nonoptional(),
            address: auth_schema_1.profileSchema.shape.address,
            phoneNumber: auth_schema_1.profileSchema.shape.phoneNumber.nonoptional(),
            email: auth_schema_1.registerFormSchema.shape.email.optional(),
            gender: auth_schema_1.profileSchema.shape.gender.optional(),
            relationType: zod_1.z.enum(complete_profile_schema_1.RelationTypeEnum),
            profession: complete_profile_schema_1.parentFormSchema.shape.profession.nonoptional(),
        })
            .optional(),
    }),
    nationality: zod_1.z.string().min(1, 'La nationalité est requis'),
    bloodGroup: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    medicalCondition: zod_1.z.string().optional(),
});
//# sourceMappingURL=students.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherAssignmentSchema = exports.classSubjectAssignmentSchema = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
const auth_schema_1 = require("./auth.schema");
exports.createTeacherSchema = zod_1.z.object({
    firstname: zod_1.z.string().min(2, 'Le prénom est requis'),
    lastname: zod_1.z.string().min(2, 'Le nom est requis'),
    gender: auth_schema_1.profileSchema.shape.gender,
    email: auth_schema_1.profileSchema.shape.email,
    phoneNumber: zod_1.z.string().optional(),
    diploma: zod_1.z.string().min(2, 'Le diplôme est requis'),
    specialization: zod_1.z.string().min(2, 'La spécialité est requise'),
});
exports.classSubjectAssignmentSchema = zod_1.z.object({
    classId: zod_1.z.cuid('Identifiant invalide.'),
    subjectIds: zod_1.z.array(zod_1.z.cuid()).min(1, 'Au moins une matière est requise'),
});
exports.teacherAssignmentSchema = zod_1.z.object({
    classId: zod_1.z.cuid('Identifiant invalide.').min(2, 'La classe est requise'),
    subjectIds: zod_1.z
        .array(zod_1.z.cuid('Identifiant invalide.'))
        .min(1, 'Au moins une matière est requise'),
    teacherId: zod_1.z.cuid('Identifiant invalide.').min(1, "L'enseignant est requis"),
});
//# sourceMappingURL=create-list-teacher.schema.js.map
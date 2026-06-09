"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParentSchema = void 0;
const zod_1 = require("zod");
const create_list_teacher_schema_1 = require("./create-list-teacher.schema");
const complete_profile_schema_1 = require("./complete-profile.schema");
exports.createParentSchema = zod_1.z.object({
    firstname: create_list_teacher_schema_1.createTeacherSchema.shape.firstname,
    lastname: create_list_teacher_schema_1.createTeacherSchema.shape.lastname,
    email: create_list_teacher_schema_1.createTeacherSchema.shape.email,
    phoneNumber: create_list_teacher_schema_1.createTeacherSchema.shape.phoneNumber,
    profession: zod_1.z.string().min(1, 'La profession est requis'),
    address: zod_1.z.string().min(3, 'Veillez entré un address valide'),
    children: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string('Veillez selectionner un élève'),
        relationType: zod_1.z.enum(complete_profile_schema_1.RelationTypeEnum),
    })),
});
//# sourceMappingURL=parent.schema.js.map
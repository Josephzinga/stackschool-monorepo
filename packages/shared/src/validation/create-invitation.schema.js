"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitationSchema = void 0;
const zod_1 = require("zod");
const roles = ['TEACHER', 'STUDENT', 'PARENT', 'STAFF', 'ADMIN'];
exports.createInvitationSchema = zod_1.z
    .object({
    schoolId: zod_1.z.string().min(1, "L'ID de l'école est requis"),
    role: zod_1.z.enum(roles, {
        error: (issue) => issue.input === undefined ? 'Le rôle est requis' : 'Rôle invalide',
    }),
    email: zod_1.z
        .string()
        .email({ pattern: zod_1.z.regexes.unicodeEmail, message: 'Email invalide' })
        .optional()
        .or(zod_1.z.literal('')),
    phoneNumber: zod_1.z
        .string()
        .min(8, 'Numéro de téléphone invalide')
        .optional()
        .or(zod_1.z.literal('')),
    message: zod_1.z.string().optional(),
    studentId: zod_1.z.string().optional(),
    classId: zod_1.z.string().optional(),
})
    .refine((data) => data.email || data.phoneNumber, {
    message: 'Vous devez fournir au moins un email ou un numéro de téléphone',
    path: ['email'],
});
//# sourceMappingURL=create-invitation.schema.js.map
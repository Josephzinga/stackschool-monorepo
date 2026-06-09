"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassSubjectSchema = exports.createSubjectForm = exports.updateLessonSchema = exports.createLessonSchema = exports.LessonStatusEnum = void 0;
const zod_1 = __importDefault(require("zod"));
var LessonStatusEnum;
(function (LessonStatusEnum) {
    LessonStatusEnum["Cancelled"] = "CANCELLED";
    LessonStatusEnum["Completed"] = "COMPLETED";
    LessonStatusEnum["Ongoing"] = "ONGOING";
    LessonStatusEnum["Planned"] = "PLANNED";
    LessonStatusEnum["Postponed"] = "POSTPONED";
})(LessonStatusEnum || (exports.LessonStatusEnum = LessonStatusEnum = {}));
var SubjectCategory;
(function (SubjectCategory) {
    SubjectCategory["General"] = "GENERAL";
    SubjectCategory["Literary"] = "LITERARY";
    SubjectCategory["Scientific"] = "SCIENTIFIC";
    SubjectCategory["Sport"] = "SPORT";
})(SubjectCategory || (SubjectCategory = {}));
const validateTimeRange = (data) => {
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM))
        return false;
    return endH > startH || (endH === startH && endM > startM);
};
exports.createLessonSchema = zod_1.default
    .object({
    id: zod_1.default.cuid().optional(),
    mode: zod_1.default.enum(['TEACHER', 'CLASS']),
    startTime: zod_1.default
        .string()
        .trim()
        .min(4, 'Veuillez entrer une heure valide')
        .max(5, "Format d'heure invalide (HH:mm)"),
    endTime: zod_1.default
        .string()
        .trim()
        .min(4, 'Veuillez entrer une heure valide')
        .max(5, "Format d'heure invalide (HH:mm)"),
    day: zod_1.default.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
    ]),
    status: zod_1.default.enum(LessonStatusEnum).optional(),
    subjectId: zod_1.default
        .string('Veuillez sélectionner une matière.')
        .min(1, 'Veuillez sélectionner une matière.'),
    teacherId: zod_1.default.string().min(1, 'Veuillez sélectionner un enseignant.'),
    groupId: zod_1.default.cuid().optional(),
    classId: zod_1.default.cuid().optional(),
})
    .refine(validateTimeRange, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['endTime'],
})
    .refine((data) => {
    return !(data.mode === 'CLASS' && !data.teacherId);
}, {
    message: 'Veuillez sélectionner un enseignant pour cette classe',
    path: ['teacherId'],
})
    .refine((data) => {
    return !(data.mode === 'TEACHER' && !data.groupId && !data.classId);
}, {
    message: 'Veuillez sélectionner une classe pour cet enseignant',
    path: ['groupId'],
});
exports.updateLessonSchema = zod_1.default.object({
    id: zod_1.default.cuid(),
    mode: zod_1.default.enum(['TEACHER', 'CLASS']),
    startTime: exports.createLessonSchema.shape.startTime.optional(),
    endTime: exports.createLessonSchema.shape.endTime.optional(),
    day: exports.createLessonSchema.shape.day.optional(),
    subjectId: zod_1.default.string().optional(),
    teacherId: zod_1.default.string().optional(),
    groupId: zod_1.default.string().optional(),
});
exports.createSubjectForm = zod_1.default.object({
    name: zod_1.default.string().min(1, 'Le nom de la matière est requis.'),
    code: zod_1.default
        .string()
        .min(1, 'Le code de la matière est requis')
        .max(10, 'Le code de la matière ne peut pas contenir plus de 10 caractères'),
    mainTeacherId: zod_1.default.string().optional(),
    category: zod_1.default.enum(SubjectCategory),
    classSubject: zod_1.default
        .array(zod_1.default.object({
        classId: zod_1.default
            .string()
            .min(1, 'Veuillez sélectionner au moins une classe.'),
        coefficient: zod_1.default
            .number()
            .min(1, 'Le coefficient de la matière est requis.'),
        weeklyHours: zod_1.default.number(),
    }))
        .optional(),
});
exports.createClassSubjectSchema = zod_1.default
    .object({
    id: zod_1.default.string().optional(),
    classId: zod_1.default.cuid('ID de classe invalide').optional(),
    teacherId: zod_1.default.string().optional(),
    subjectId: zod_1.default.cuid('ID de matière invalide'),
    coefficient: zod_1.default.coerce
        .number()
        .min(1, 'Le coefficient ne doit pas être inférieur ou égal à 0'),
    weeklyHours: zod_1.default.coerce
        .number()
        .min(1, "Le nombre d'heures ne doit pas être inférieur ou égal à 0")
        .optional(),
})
    .refine((data) => {
    return !!data.id || !!data.classId;
}, {
    error: 'La classe est requise',
    path: ['classId'],
});
//# sourceMappingURL=subject-list.schema.js.map
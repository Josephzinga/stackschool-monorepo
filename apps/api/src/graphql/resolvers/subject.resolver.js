"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectResolver = void 0;
const api_errors_1 = require("../../utils/api-errors");
const db_1 = require("@stackschool/db");
const verify_role_1 = require("../../lib/verify-role");
const validate_schema_util_1 = require("../../utils/validate-schema.util");
const shared_1 = require("@stackschool/shared");
const lesson_get_hours_1 = require("../../utils/lesson-get-hours");
exports.subjectResolver = {
    Query: {
        getSchoolSubjects: async (_, { input: { searchTerm, page = 0, classId, teacherId, sort, limit = 10 } }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifier');
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant maquant');
            const skip = page * limit;
            const search = searchTerm?.trim();
            let whereClause = {
                schoolId,
            };
            if (search) {
                whereClause = {
                    ...whereClause,
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { code: { contains: search, mode: 'insensitive' } },
                    ],
                };
            }
            if (teacherId) {
                whereClause = {
                    ...whereClause,
                    classSubjects: {
                        some: {
                            teacherId,
                        },
                    },
                };
            }
            let orderBy = {
                name: 'asc',
            };
            const [total, subject] = await Promise.all([
                await db_1.prisma.subject.count({
                    where: whereClause,
                }),
                await db_1.prisma.subject.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                    orderBy,
                }),
            ]);
            return {
                data: subject,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        },
    },
    Mutation: {
        createSubject: async (_, { input }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifier', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createSubjectForm, input);
            if (!success) {
                throw (0, api_errors_1.createServiceError)(errors ? errors[0].message : 'Erreur de validation', 400);
            }
            const checked = await (0, verify_role_1.isAdmin)({ context: { userId: user.id, schoolId } });
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked.message || 'Non autorisé');
            }
            const exist = await db_1.prisma.subject.findFirst({
                where: {
                    schoolId,
                    OR: [
                        { name: { equals: data?.name, mode: 'insensitive' } },
                        { code: { equals: data?.code, mode: 'insensitive' } },
                    ],
                },
            });
            if (exist)
                throw (0, api_errors_1.createServiceError)('Cette matière existe déjà.', 403);
            const subject = await db_1.prisma.$transaction(async (tx) => {
                const subject = await tx.subject.create({
                    data: {
                        schoolId,
                        name: data?.name,
                        code: data?.code,
                        mainTeacherId: data?.mainTeacherId,
                        category: data?.category,
                    },
                });
                const group = await db_1.prisma.group.findFirst({
                    where: {
                        classes: {
                            some: {
                                id: data.classId
                            }
                        }
                    }
                });
                if (data?.classSubject) {
                    for (const cls of data?.classSubject) {
                        await tx.classSubjects.create({
                            data: {
                                schoolId,
                                subjectId: subject?.id,
                                groupId: '',
                                coefficient: cls?.coefficient,
                                weeklyHours: cls?.weeklyHours,
                            },
                        });
                    }
                }
                return subject;
            });
            return {
                ...subject,
                category: subject?.category,
            };
        },
        deleteSubjects: async (_, { subjectIds }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifier', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const checked = await (0, verify_role_1.isAdmin)({ context: { userId: user.id, schoolId } });
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked.message || 'Non autorisé');
            }
            const exist = await db_1.prisma.subject.findMany({
                where: {
                    schoolId,
                    id: {
                        in: [...subjectIds],
                    },
                },
            });
            if (!exist || exist?.length === 0)
                throw (0, api_errors_1.createServiceError)("Ces matières n'existe pas");
            const subjects = await db_1.prisma.subject.deleteMany({
                where: {
                    id: {
                        in: [...subjectIds],
                    },
                },
            });
            return {
                ok: true,
                message: `${subjects.count} matière supprimer avec succès`,
            };
        },
    },
    Subject: {
        classSubject: async (parent) => {
            return db_1.prisma.classSubjects.findMany({
                where: {
                    subjectId: parent.id,
                },
            });
        },
        totalWeeklyHours: async (parent, _args, { loaders }) => {
            const lessons = await loaders.lessonsBySubjectLoader.load(parent.id);
            return (0, lesson_get_hours_1.getWeeklyHours)(lessons);
        },
        mainTeacher: async (parent, _args, { loaders }) => {
            if (!parent.mainTeacherId)
                return null;
            return await loaders.teacherLoader.load(parent.mainTeacherId);
        },
    },
};
//# sourceMappingURL=subject.resolver.js.map
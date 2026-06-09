"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSubjectMutationResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
const db_1 = require("@stackschool/db");
const shared_1 = require("@stackschool/shared");
const validate_schema_util_1 = require("../../../utils/validate-schema.util");
exports.classSubjectMutationResolver = {
    Mutation: {
        createClassSubject: async (_, { input }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createClassSubjectSchema, input);
            if (!success) {
                throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation', 400, errors);
            }
            const { subjectId, teacherId, coefficient, weeklyHours } = data;
            const classId = input?.classId;
            if (!classId || !subjectId)
                throw (0, api_errors_1.createServiceError)('Donnée manquat');
            try {
                const checked = await (0, verify_role_1.isAdmin)({
                    context: { userId: user.id, schoolId },
                });
                if (!checked?.success) {
                    throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accorder', 403);
                }
                const exist = await db_1.prisma.classSubjects.findFirst({
                    where: {
                        subjectId,
                        group: {
                            classes: {
                                some: {
                                    id: classId,
                                },
                            },
                        },
                    },
                });
                if (exist) {
                    throw (0, api_errors_1.createServiceError)('La matière existe déjà dans cette classe.');
                }
                return await db_1.prisma.$transaction(async (tx) => {
                    const group = await tx.group.findFirst({
                        where: {
                            classes: {
                                some: {
                                    id: classId,
                                },
                            },
                        },
                    });
                    const classSubject = await tx.classSubjects.create({
                        data: {
                            schoolId,
                            group: {
                                connect: {
                                    id: group?.id,
                                },
                            },
                            subject: {
                                connect: { id: subjectId },
                            },
                            coefficient: coefficient,
                            weeklyHours: weeklyHours,
                        },
                    });
                    if (input?.teacherId) {
                        await tx.teacherAssignment.create({
                            data: {
                                schoolId,
                                classSubjectId: classSubject.id,
                                teacherId: teacherId,
                            },
                        });
                    }
                    return classSubject;
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message ||
                    'Erreur lors de la creation de la matière dans la classe');
            }
        },
        updateClassSubject: async (_, { input }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createClassSubjectSchema, input);
            if (!success) {
                throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation', 400, errors);
            }
            const { id, subjectId, teacherId, coefficient, weeklyHours } = data;
            const checked = await (0, verify_role_1.isAdmin)({ context: { userId: user.id, schoolId } });
            if (!checked?.success) {
                throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accorder', 403);
            }
            const exist = await db_1.prisma.classSubjects.findUnique({
                where: {
                    id,
                },
            });
            if (!exist) {
                throw (0, api_errors_1.createServiceError)('Matière introuvable.');
            }
            return await db_1.prisma.classSubjects.update({
                where: {
                    id,
                },
                data: {
                    assignments: {
                        update: {
                            ...(teacherId && {
                                teacherId,
                            }),
                        },
                    },
                    subject: {
                        ...(subjectId && {
                            connect: {
                                id: subjectId ?? undefined,
                            },
                        }),
                    },
                    coefficient: coefficient,
                    weeklyHours: weeklyHours ?? undefined,
                },
            });
        },
        deleteClassSubjects: async (_, { ids }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const checked = await (0, verify_role_1.isAdmin)({ context: { userId: user.id, schoolId } });
            if (!checked?.success) {
                throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accorder', 403);
            }
            const classSubjects = await db_1.prisma.$transaction(async (tx) => {
                return await tx.classSubjects.deleteMany({
                    where: {
                        id: {
                            in: [...ids],
                        },
                    },
                });
            });
            return {
                ok: true,
                message: `${classSubjects?.count} supprimer avec succès.`,
            };
        },
    },
};
//# sourceMappingURL=classSubject-mutation.resolver.js.map
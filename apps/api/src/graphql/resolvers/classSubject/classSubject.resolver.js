"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSubjectResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
const lesson_get_hours_1 = require("../../../utils/lesson-get-hours");
exports.classSubjectResolver = {
    Query: {
        getAssignments: async (_, { filter: { classId, groupId, teacherId, limit } }, { schoolId, user, prisma }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            try {
                const checkedRole = await (0, verify_role_1.checkRole)({
                    context: { userId: user.id, schoolId },
                    roles: ['TEACHER', 'ADMIN'],
                });
                if (!checkedRole.success) {
                    throw (0, api_errors_1.createServiceError)(checkedRole.message || 'Permission non accordée');
                }
                let whereClause = {
                    schoolId,
                };
                if (teacherId) {
                    whereClause = {
                        ...whereClause,
                        teacherId,
                    };
                }
                if (groupId) {
                    whereClause = {
                        ...whereClause,
                        classSubject: {
                            group: {
                                id: groupId,
                            },
                        },
                    };
                }
                if (classId) {
                    whereClause = {
                        ...whereClause,
                        classSubject: {
                            group: {
                                classes: {
                                    some: {
                                        id: classId,
                                    },
                                },
                            },
                        },
                    };
                }
                return await prisma.teacherAssignment.findMany({
                    where: whereClause,
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message || 'Erreur interne du serveur');
            }
        },
        getClassSubjects: async (_, { classId, teacherId, groupId }, { user, schoolId, prisma }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const ids = [classId, teacherId, groupId];
            if (ids.filter((id) => id !== undefined && (id !== null || '')).length > 1) {
                throw (0, api_errors_1.createServiceError)('Viellez specifier un seule identifiant');
            }
            const checked = await (0, verify_role_1.checkRole)({
                context: { userId: user?.id, schoolId },
                roles: ['TEACHER', 'ADMIN', 'PARENT'],
            });
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked?.message || 'permission non accordé', 403);
            }
            return prisma.classSubjects.findMany({
                where: {
                    group: {
                        id: groupId ?? undefined,
                        ...(classId && {
                            classes: {
                                some: {
                                    id: classId ?? undefined,
                                },
                            },
                        }),
                    },
                    ...(teacherId && {
                        assignments: {
                            teacherId,
                        },
                    }),
                },
            });
        },
    },
    ClassSubject: {
        assignment: async (parent, _, { loaders }) => {
            return await loaders.assignmentsByClassSubjectLoader.load(parent.id);
        },
        weeklyHours: async (parent, _args, { loaders }) => {
            const lessons = await loaders.lessonsByClassSubjectLoader.load(parent.id);
            return (0, lesson_get_hours_1.getWeeklyHours)(lessons);
        },
        subject: async (parent, _, { loaders }) => {
            if (!parent.subjectId) {
                throw (0, api_errors_1.createServiceError)('Identifiant du sujet manquant', 400);
            }
            const subject = await loaders.subjectLoader.load(parent.subjectId);
            if (!subject) {
                throw (0, api_errors_1.createServiceError)('Sujet introuvable', 404);
            }
            return subject;
        },
        group: async (parent, _args, { loaders }) => {
            if (!parent.groupId) {
                throw (0, api_errors_1.createServiceError)('Identifiant du groupe manquant', 400);
            }
            const group = await loaders.groupLoader.load(parent.groupId);
            return group;
        },
    },
    TeacherAssignments: {
        teacher: async (parent, _, { loaders }) => {
            return (await loaders.teacherLoader.load(parent.teacherId)) || null;
        },
        classSubjects: async (parent, _, { loaders }) => {
            const classSubject = await loaders.classSubjectLoader.load(parent.classSubjectId);
            return classSubject || null;
        },
    },
};
//# sourceMappingURL=classSubject.resolver.js.map
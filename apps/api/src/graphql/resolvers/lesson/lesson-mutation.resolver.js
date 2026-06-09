"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonMutationResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const db_1 = require("@stackschool/db");
const verify_role_1 = require("../../../lib/verify-role");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const shared_1 = require("@stackschool/shared");
const validate_schema_util_1 = require("../../../utils/validate-schema.util");
exports.lessonMutationResolver = {
    Mutation: {
        createLesson: async (_, { input }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement est manquant", 400);
            const { success, errors, data } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.createLessonSchema, input);
            if (!success)
                throw (0, api_errors_1.createServiceError)(errors?.[0]?.message || 'Erreur de validation', 400, errors);
            if (!data)
                return null;
            const { startTime, endTime, day, subjectId, teacherId, groupId, classId, mode, } = data;
            const checked = await (0, verify_role_1.checkRole)({
                context: { userId: user.id, schoolId },
                roles: ['TEACHER', 'ADMIN'],
            });
            if (!checked.success || !checked.member)
                throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accordée', 403);
            const member = checked.member;
            if (member.role === 'TEACHER' && teacherId !== member.teacher?.id) {
                throw (0, api_errors_1.createServiceError)('Vous ne pouvez pas créer une leçon pour un autre professeur', 403);
            }
            const start = (0, date_fns_1.parse)(`${day} ${startTime}`, 'EEEE HH:mm', shared_1.REFERENCE_DATE, {
                locale: locale_1.enUS,
            });
            const end = (0, date_fns_1.parse)(`${day} ${endTime}`, 'EEEE HH:mm', shared_1.REFERENCE_DATE, {
                locale: locale_1.enUS,
            });
            const currentCS = await db_1.prisma.classSubjects.findUnique({
                where: {
                    groupId_subjectId: { groupId: groupId, subjectId },
                },
                include: {
                    assignments: true,
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                    group: {
                        include: {
                            classes: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!currentCS)
                throw (0, api_errors_1.createServiceError)("Cette matière n'est pas enseigné dans cette Classe. ");
            const assignments = await db_1.prisma.teacherAssignment.findUnique({
                where: {
                    schoolId_classSubjectId_teacherId: {
                        schoolId,
                        classSubjectId: currentCS.id,
                        teacherId,
                    },
                },
            });
            if (!assignments) {
                throw (0, api_errors_1.createServiceError)(`Le professeur n'enseigne pas ${currentCS.subject?.name} dans ${currentCS.group?.classes?.[0]?.name}`);
            }
            const existingLessons = await db_1.prisma.lesson.findMany({
                where: {
                    schoolId,
                    day,
                    OR: [
                        {
                            teacherAssignment: {
                                classSubject: { groupId: currentCS.groupId },
                            },
                        },
                        { teacherAssignmentId: teacherId },
                    ],
                },
            });
            const newEvent = {
                startTime,
                endTime,
                daysOfWeek: [shared_1.dayMapping[day]],
            };
            const existingEvents = existingLessons.map((l) => ({
                startTime: (0, date_fns_1.format)(l.startTime, 'HH:mm'),
                endTime: (0, date_fns_1.format)(l.endTime, 'HH:mm'),
                daysOfWeek: [shared_1.dayMapping[l.day]],
            }));
            const hasConflict = (0, shared_1.checkEventConflicts)(newEvent, existingEvents);
            if (hasConflict) {
                throw (0, api_errors_1.createServiceError)(`Conflit d'horaire : ${mode === 'CLASS'
                    ? `Le professeur est déjà occupé sur cette plage`
                    : `La classe a déjà un cours sur cette plage`}`);
            }
            return db_1.prisma.lesson.create({
                data: {
                    schoolId,
                    teacherAssignmentId: assignments.id,
                    startTime: start,
                    endTime: end,
                    day,
                },
            });
        },
        updateLessonStatus: async (_, { status, id }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const checked = await (0, verify_role_1.checkRole)({
                context: { userId: user?.id, schoolId },
                roles: ['TEACHER', 'ADMIN'],
            });
            if (!checked?.success || !checked.member) {
                throw (0, api_errors_1.createServiceError)(checked?.message || 'Permission non accordée', 403);
            }
            const member = checked.member;
            const lesson = await db_1.prisma.lesson.findUnique({
                where: { id, schoolId },
            });
            if (!lesson)
                throw (0, api_errors_1.createServiceError)('Leçon introuvable', 404);
            if (member.role === 'TEACHER' &&
                lesson.teacherAssignmentId !== member.teacher?.id) {
                throw (0, api_errors_1.createServiceError)("Vous n'êtes pas autorisé à modifier le statut de cette leçon", 403);
            }
            if (!(0, shared_1.canTransition)(lesson.status, status)) {
                throw (0, api_errors_1.createServiceError)(`Transition de statut impossible ${lesson.status} vers ${status}`, 400);
            }
            return db_1.prisma.lesson.update({
                where: { id },
                data: { status },
            });
        },
        updateLesson: async (_, { input }, { schoolId, user }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const { data, errors, success } = (0, validate_schema_util_1.safeValidateSchema)(shared_1.updateLessonSchema, input);
            if (!success) {
                throw (0, api_errors_1.createServiceError)(errors?.[0].message || 'Erreur de validation', 400, errors);
            }
            try {
                const checked = await (0, verify_role_1.checkRole)({
                    context: { schoolId, userId: user.id },
                    roles: ['TEACHER', 'ADMIN'],
                });
                if (!checked.success || !checked.member)
                    throw (0, api_errors_1.createServiceError)(checked.message || 'Permission non accordée.', 403);
                const member = checked.member;
                const { id, day, startTime, endTime, subjectId, groupId, teacherId, mode, } = data;
                const lesson = await db_1.prisma.lesson.findUnique({
                    where: { id, schoolId },
                    include: {
                        teacherAssignment: {
                            include: {
                                classSubject: {
                                    include: {
                                        subject: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!lesson)
                    throw (0, api_errors_1.createServiceError)('Leçon introuvable', 404);
                if (lesson.status !== 'PLANNED') {
                    throw (0, api_errors_1.createServiceError)(`Cette leçon est déjà "${shared_1.lessonStatusConfig[lesson.status].label.toLocaleUpperCase()}". Vous ne pouvez plus modifier sa ressource ou son horaire.`, 400);
                }
                if (member.role === 'TEACHER' &&
                    lesson.teacherAssignmentId !== member.teacher?.id) {
                    throw (0, api_errors_1.createServiceError)("Vous n'êtes pas autorisé à modifier cette leçon", 403);
                }
                const isClassMode = mode === 'CLASS';
                const targetGroupId = groupId || lesson.teacherAssignment.classSubject.groupId;
                const targetTeacherId = teacherId || lesson.teacherAssignmentId;
                const targetSubjectId = subjectId || lesson.teacherAssignment.classSubject.subjectId;
                const shouldCheckClassSubject = Boolean(targetGroupId !== lesson.teacherAssignment?.classSubject?.groupId ||
                    targetSubjectId !== lesson.teacherAssignment.classSubject.subjectId);
                let currentCS = {
                    ...lesson.teacherAssignment.classSubject,
                };
                if (shouldCheckClassSubject) {
                    currentCS = await db_1.prisma.classSubjects.findUnique({
                        where: {
                            groupId_subjectId: {
                                subjectId: targetSubjectId,
                                groupId: targetGroupId,
                            },
                        },
                    });
                }
                if (!currentCS) {
                    throw (0, api_errors_1.createServiceError)(`Cette matière n'est pas enseigné dans cette classe`);
                }
                let assignment = {
                    ...lesson.teacherAssignment,
                };
                if (targetTeacherId !== lesson.teacherAssignmentId) {
                    assignment = await db_1.prisma.teacherAssignment.findUnique({
                        where: {
                            schoolId_classSubjectId_teacherId: {
                                schoolId,
                                classSubjectId: currentCS.id,
                                teacherId: targetTeacherId,
                            },
                        },
                    });
                }
                if (!assignment) {
                    throw (0, api_errors_1.createServiceError)(`Cet professeur n'enseigne pas cette matière`);
                }
                const activeDay = day || lesson.day;
                if (startTime || endTime || day) {
                    const existingLessons = await db_1.prisma.lesson.findMany({
                        where: {
                            schoolId,
                            day: activeDay,
                            OR: [
                                {
                                    teacherAssignment: {
                                        classSubject: {
                                            groupId: targetGroupId,
                                        },
                                    },
                                },
                                { teacherAssignmentId: targetTeacherId },
                            ],
                        },
                    });
                    const hasConflict = (0, shared_1.checkEventConflicts)({
                        startTime: startTime || (0, date_fns_1.format)(lesson.startTime, 'HH:mm'),
                        endTime: endTime || (0, date_fns_1.format)(lesson.endTime, 'HH:mm'),
                        daysOfWeek: [shared_1.dayMapping[activeDay]],
                    }, existingLessons.map((l) => ({
                        id: l.id,
                        startTime: (0, date_fns_1.format)(l.startTime, 'HH:mm'),
                        endTime: (0, date_fns_1.format)(l.endTime, 'HH:mm'),
                        daysOfWeek: [shared_1.dayMapping[l.day]],
                    })), lesson.id);
                    if (hasConflict) {
                        throw (0, api_errors_1.createServiceError)(!isClassMode
                            ? `Conflit détecté : la classe est déjà occupé sur ce créneau `
                            : 'Conflit détecté : le professeur est déjà occupé sur ce créneau');
                    }
                }
                const start = startTime
                    ? (0, date_fns_1.parse)(`${day || lesson.day} ${startTime}`, 'EEEE HH:mm', shared_1.REFERENCE_DATE)
                    : lesson.startTime;
                const end = endTime
                    ? (0, date_fns_1.parse)(`${day || lesson.day} ${endTime}`, 'EEEE HH:mm', shared_1.REFERENCE_DATE)
                    : lesson.endTime;
                return await db_1.prisma.lesson.update({
                    where: { id },
                    data: {
                        startTime: start,
                        endTime: end,
                        day: activeDay,
                        teacherAssignmentId: assignment.id,
                    },
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message ||
                    'Une erreur est survenue lors de la mise à jour du leçon');
            }
        },
        deleteLesson: async (_, { id }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)('Identifiant manquant', 400);
            const checked = await (0, verify_role_1.checkRole)({
                context: { userId: user.id, schoolId },
                roles: ['ADMIN', 'TEACHER'],
            });
            if (!checked.success || !checked.member)
                throw (0, api_errors_1.createServiceError)(checked.message || 'Permission non accordée', 403);
            const member = checked.member;
            const exist = await db_1.prisma.lesson.findUnique({
                where: { id, schoolId },
                include: {
                    teacherAssignment: true,
                },
            });
            if (!exist)
                throw (0, api_errors_1.createServiceError)('Leçon introuvable', 404);
            if (member.role === 'TEACHER' &&
                exist?.teacherAssignment.teacherId !== member.teacher?.id) {
                throw (0, api_errors_1.createServiceError)("Vous n'êtes pas autorisé à supprimer cette leçon", 403);
            }
            await db_1.prisma.lesson.delete({ where: { id } });
            return {
                ok: true,
                message: 'Leçon supprimée avec succès.',
            };
        },
    },
};
//# sourceMappingURL=lesson-mutation.resolver.js.map
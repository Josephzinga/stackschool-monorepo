"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classResolver = void 0;
const db_1 = require("@stackschool/db");
const lesson_get_hours_1 = require("../../../utils/lesson-get-hours");
exports.classResolver = {
    Class: {
        students: async (parent, _args, { loaders }) => {
            return loaders.studentsByClassLoader.load(parent.id);
        },
        _count: async (parent, _args, { loaders }) => {
            const counts = await loaders.classCountLoader.load(parent.id);
            return {
                students: counts.students,
                subjects: counts.subjects,
                teachers: counts.teachers,
            };
        },
        supervisor: async (parent, _args, { loaders }) => {
            return (await loaders.supervisorByClassLoader.load(parent.id)) || null;
        },
        group: async (parent, _args, { loaders }) => {
            return (await loaders.groupLoader.load(parent.groupId)) || null;
        },
        teachingTeamMembers: async (parent) => {
            const assignments = await db_1.prisma.teacherAssignment.findMany({
                where: {
                    classSubject: {
                        groupId: parent.groupId,
                    },
                },
                include: {
                    teacher: {
                        select: {
                            id: true,
                            schoolUserId: true,
                        },
                    },
                    classSubject: {
                        include: { subject: true },
                    },
                },
            });
            const teamMap = new Map();
            assignments.forEach((asm) => {
                const teacherId = asm.teacherId;
                if (!teamMap.has(teacherId)) {
                    teamMap.set(teacherId, {
                        teacher: asm.teacher,
                        assignments: [],
                    });
                }
                teamMap.get(teacherId).assignments.push({
                    subject: asm.classSubject.subject,
                    id: asm.id,
                });
            });
            return Array.from(teamMap.values());
        },
        totalCoefficient: async (parent, _args, { prisma }) => {
            const total = await prisma.classSubjects.aggregate({
                where: {
                    groupId: parent.groupId,
                },
                _sum: {
                    coefficient: true,
                },
            });
            return total._sum.coefficient || 0;
        },
        totalWeeklyHours: async (parent, _args, { loaders }) => {
            const lessons = await loaders.lessonsByGroupLoader.load(parent.groupId);
            return (0, lesson_get_hours_1.getWeeklyHours)(lessons);
        },
    },
};
//# sourceMappingURL=class.resolver.js.map
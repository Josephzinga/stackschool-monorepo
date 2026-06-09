"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaders = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const createLoaders = (prisma) => {
    return {
        userLoader: new dataloader_1.default(async (schoolUserIds) => {
            const schoolUsers = await prisma.schoolUser.findMany({
                where: { id: { in: [...schoolUserIds] } },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            phoneNumber: true,
                            username: true,
                            isActive: true,
                            emailVerified: true,
                            hasMembership: true,
                            profileCompleted: true,
                            profile: true,
                        },
                    },
                },
            });
            const userMap = new Map(schoolUsers.map((su) => [su.id, su.user]));
            return schoolUserIds.map((id) => userMap.get(id));
        }),
        classSubjectLoader: new dataloader_1.default(async (ids) => {
            const classSubjects = await prisma.classSubjects.findMany({
                where: { id: { in: [...ids] } },
            });
            const map = new Map(classSubjects.map((cls) => [cls.id, cls]));
            return ids.map((id) => map.get(id));
        }),
        classSubjectByGroupLoader: new dataloader_1.default(async (groupIds) => {
            const classSubjects = await prisma.classSubjects.findMany({
                where: { groupId: { in: [...groupIds] } },
            });
            return groupIds.map((id) => classSubjects.filter((cls) => cls.groupId === id));
        }),
        subjectLoader: new dataloader_1.default(async (ids) => {
            const subjects = await prisma.subject.findMany({
                where: { id: { in: [...ids] } },
            });
            const map = new Map(subjects.map((s) => [s.id, s]));
            return ids.map((id) => map.get(id));
        }),
        teacherLoader: new dataloader_1.default(async (teacherIds) => {
            const teachers = await prisma.teacher.findMany({
                where: {
                    id: { in: [...teacherIds] },
                },
            });
            const map = new Map(teachers.map((t) => [t.id, t]));
            return teacherIds.map((id) => map.get(id));
        }),
        classLoader: new dataloader_1.default(async (classIds) => {
            const classes = await prisma.class.findMany({
                where: {
                    id: { in: [...classIds] },
                },
            });
            const map = new Map(classes.map((cl) => [cl.id, cl]));
            return classIds.map((id) => map.get(id));
        }),
        classByGroupLoader: new dataloader_1.default(async (groupIds) => {
            const classes = await prisma.class.findMany({
                where: {
                    groupId: {
                        in: [...groupIds],
                    },
                },
            });
            return groupIds.map((id) => classes.filter((cls) => cls.groupId === id));
        }),
        lessonsByIdLoader: new dataloader_1.default(async (ids) => {
            const lessons = await prisma.lesson.findMany({
                where: { id: { in: [...ids] } },
            });
            const map = new Map(lessons.map((l) => [l.id, l]));
            return ids.map((id) => map.get(id));
        }),
        lessonsByClassSubjectLoader: new dataloader_1.default(async (classSubjectIds) => {
            const lessons = await prisma.lesson.findMany({
                where: {
                    teacherAssignment: { classSubjectId: { in: [...classSubjectIds] } },
                },
                include: {
                    teacherAssignment: true,
                },
            });
            return classSubjectIds.map((csId) => lessons.filter((l) => l.teacherAssignment?.classSubjectId === csId));
        }),
        lessonsBySubjectLoader: new dataloader_1.default(async (subjectIds) => {
            const lessons = await prisma.lesson.findMany({
                where: {
                    teacherAssignment: {
                        classSubject: {
                            subject: {
                                id: { in: [...subjectIds] },
                            },
                        },
                    },
                },
                include: {
                    teacherAssignment: {
                        select: {
                            classSubject: {
                                select: {
                                    subject: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return subjectIds.map((id) => lessons.filter((l) => l.teacherAssignment.classSubject.subject.id === id));
        }),
        lessonsByTeacherLoader: new dataloader_1.default(async (teacherIds) => {
            const lessons = await prisma.lesson.findMany({
                where: {
                    teacherAssignment: {
                        teacherId: { in: [...teacherIds] },
                    },
                },
                include: {
                    teacherAssignment: true,
                },
            });
            return teacherIds.map((id) => lessons.filter((l) => l.teacherAssignment.teacherId === id));
        }),
        groupLoader: new dataloader_1.default(async (groupIds) => {
            const group = await prisma.group.findMany({
                where: {
                    id: { in: [...groupIds] },
                },
            });
            const map = new Map(group.map((g) => [g.id, g]));
            return groupIds.map((id) => map.get(id));
        }),
        studentsByClassLoader: new dataloader_1.default(async (classIds) => {
            const students = await prisma.student.findMany({
                where: { classId: { in: [...classIds] } },
                include: { profile: true },
            });
            return classIds.map((id) => students.filter((s) => s.classId === id));
        }),
        subjectsByClassLoader: new dataloader_1.default(async (classIds) => {
            const classSubjects = await prisma.classSubjects.findMany({
                where: {
                    group: { classes: { some: { id: { in: [...classIds] } } } },
                },
                include: {
                    subject: true,
                    group: { select: { classes: { select: { id: true } } } },
                },
            });
            return classIds.map((id) => classSubjects
                .filter((cs) => cs.group.classes.some((c) => c.id === id))
                .map((cs) => cs.subject));
        }),
        supervisorByClassLoader: new dataloader_1.default(async (classIds) => {
            const classes = await prisma.class.findMany({
                where: { id: { in: [...classIds] } },
                include: { supervisor: true },
            });
            const map = new Map(classes.map((c) => [c.id, c.supervisor]));
            return classIds.map((id) => map.get(id));
        }),
        lessonsByGroupLoader: new dataloader_1.default(async (groupIds) => {
            const lessons = await prisma.lesson.findMany({
                where: {
                    teacherAssignment: {
                        classSubject: { group: { id: { in: [...groupIds] } } },
                    },
                },
                include: {
                    teacherAssignment: {
                        select: { classSubject: { select: { groupId: true } } },
                    },
                },
            });
            return groupIds.map((id) => lessons.filter((l) => l.teacherAssignment.classSubject.groupId === id));
        }),
        classCountLoader: new dataloader_1.default(async (classIds) => {
            const [students, subjectsCount, teachersCount] = await Promise.all([
                prisma.profile.groupBy({
                    by: ['gender'],
                    where: { student: { classId: { in: [...classIds] } } },
                    _count: {
                        id: true,
                    },
                }),
                prisma.classSubjects.count({
                    where: {
                        group: {
                            classes: {
                                some: {
                                    id: { in: [...classIds] },
                                },
                            },
                        },
                    },
                }),
                prisma.teacherAssignment.count({
                    where: {
                        classSubject: {
                            group: {
                                classes: {
                                    some: {
                                        id: {
                                            in: [...classIds],
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
            ]);
            return classIds.map((id) => ({
                students: {
                    male: students.find((s) => s.gender === 'MALE')?._count.id || 0,
                    female: students.find((s) => s.gender === 'FEMALE')?._count.id || 0,
                },
                subjects: subjectsCount,
                teachers: teachersCount,
            }));
        }),
        assignmentsByClassSubjectLoader: new dataloader_1.default(async (classSubjectIds) => {
            const assignments = await prisma.teacherAssignment.findMany({
                where: {
                    classSubjectId: { in: [...classSubjectIds] },
                },
            });
            const map = new Map(assignments.map((ass) => [ass.classSubjectId, ass]));
            return classSubjectIds.map((id) => map.get(id));
        }),
        assignmentsByTeacherLoader: new dataloader_1.default(async (teacherIds) => {
            const assignments = await prisma.teacherAssignment.findMany({
                where: {
                    teacherId: { in: [...teacherIds] },
                },
            });
            return teacherIds.map((id) => assignments.filter((ass) => ass.teacherId === id));
        }),
    };
};
exports.createLoaders = createLoaders;
//# sourceMappingURL=data-loader.js.map
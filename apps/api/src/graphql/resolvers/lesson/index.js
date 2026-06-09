"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformLessonToEvent = exports.fetchLessons = exports.fetchGroups = exports.fetchTeachers = exports.groupWhereClause = exports.teacherWhereClause = exports.lessonResolvers = void 0;
const db_1 = require("@stackschool/db");
const lesson_mutation_resolver_1 = require("./lesson-mutation.resolver");
const lesson_query_resolver_1 = require("./lesson-query.resolver");
const lessons_resolver_1 = require("./lessons.resolver");
exports.lessonResolvers = {
    ...lesson_mutation_resolver_1.lessonMutationResolver,
    ...lesson_query_resolver_1.lessonQueryResolver,
    ...lessons_resolver_1.lessonsResolver,
};
const teacherWhereClause = (filter, schoolId) => {
    const { teacherId, groupId, hasLessonOnly } = filter;
    const assignmentWhereClause = [];
    if (hasLessonOnly)
        assignmentWhereClause.push({ lessons: { some: {} } });
    if (groupId)
        assignmentWhereClause.push({ classSubject: { group: { id: groupId } } });
    return {
        schoolUser: { schoolId },
        ...(teacherId && { id: teacherId }),
        ...(assignmentWhereClause.length > 0 && {
            assignments: { some: { AND: assignmentWhereClause } },
        }),
    };
};
exports.teacherWhereClause = teacherWhereClause;
const groupWhereClause = (filter, schoolId) => {
    const { groupId, teacherId, classId, hasLessonOnly } = filter;
    const assignmentWhereClause = [];
    if (hasLessonOnly)
        assignmentWhereClause.push({ assignments: { lessons: { some: {} } } });
    if (teacherId)
        assignmentWhereClause.push({ assignments: { teacherId } });
    if (classId)
        assignmentWhereClause.push({
            group: { classes: { some: { id: classId } } },
        });
    return {
        schoolId,
        ...(groupId && { id: groupId }),
        classSubjects: { some: { AND: assignmentWhereClause } },
    };
};
exports.groupWhereClause = groupWhereClause;
const fetchTeachers = async (where, skip, limit) => {
    return db_1.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { schoolUser: { user: { profile: { firstname: 'asc' } } } },
        include: {
            schoolUser: {
                select: {
                    user: {
                        select: {
                            profile: { select: { firstname: true, lastname: true } },
                        },
                    },
                },
            },
        },
    });
};
exports.fetchTeachers = fetchTeachers;
const fetchGroups = async (where, skip, limit) => {
    const [groups, totalCount] = await Promise.all([
        db_1.prisma.group.findMany({
            where,
            include: { classes: true },
            take: limit,
            skip,
        }),
        db_1.prisma.group.count({ where }),
    ]);
    return { groups, totalCount };
};
exports.fetchGroups = fetchGroups;
const fetchLessons = async (schoolId, mode, teacherIds, groupIds, status) => {
    const lessonWhere = {
        schoolId,
        ...(status && { status }),
        teacherAssignment: mode === 'TEACHER'
            ? { teacher: { id: { in: teacherIds } } }
            : { classSubject: { group: { id: { in: groupIds } } } },
    };
    return db_1.prisma.lesson.findMany({
        where: lessonWhere,
        include: {
            teacherAssignment: {
                include: {
                    teacher: {
                        select: {
                            id: true,
                            schoolUser: {
                                select: {
                                    user: {
                                        select: {
                                            profile: { select: { firstname: true, lastname: true } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    classSubject: {
                        include: {
                            group: {
                                include: {
                                    classes: {
                                        select: {
                                            id: true,
                                            name: true,
                                            level: true,
                                            groupId: true,
                                        },
                                    },
                                },
                            },
                            subject: { select: { id: true, name: true, code: true } },
                        },
                    },
                },
            },
        },
    });
};
exports.fetchLessons = fetchLessons;
const transformLessonToEvent = (lesson, mode) => ({
    id: lesson.id,
    resourceId: mode === 'TEACHER'
        ? lesson.teacherAssignment?.teacherId
        : lesson?.teacherAssignment?.classSubject?.groupId,
    title: lesson?.teacherAssignment?.classSubject.subject.name,
    status: lesson?.status,
    startTime: lesson?.startTime?.toISOString(),
    endTime: lesson?.endTime?.toISOString(),
    subject: lesson?.teacherAssignment?.classSubject?.subject,
    day: lesson?.day,
    teacher: {
        id: lesson?.teacherAssignment.teacher?.id ?? '',
        firstname: lesson?.teacherAssignment.teacher?.schoolUser.user.profile?.firstname ??
            '',
        lastname: lesson?.teacherAssignment?.teacher?.schoolUser.user?.profile?.lastname ??
            '',
    },
    group: lesson?.teacherAssignment?.classSubject?.group,
});
exports.transformLessonToEvent = transformLessonToEvent;
//# sourceMappingURL=index.js.map
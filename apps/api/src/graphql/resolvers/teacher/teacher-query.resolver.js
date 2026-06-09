"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherQueryResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
exports.teacherQueryResolver = {
    Query: {
        getSchoolTeachers: async (_, { input }, { user, schoolId, prisma }) => {
            try {
                (0, verify_role_1.checkUser)(user);
                (0, verify_role_1.checkSchoolId)(schoolId);
                if (!input) {
                    throw (0, api_errors_1.createServiceError)('Données manquantes', 400);
                }
                const { page = 0, limit = 10, searchTerm, classId, subjectId, isActive, isSupervisor, day, } = input;
                const skip = page * limit;
                const search = searchTerm?.trim();
                const whereClause = {
                    schoolUser: { schoolId },
                };
                if (isActive !== undefined && isActive !== null) {
                    whereClause.isActive = isActive;
                }
                if (subjectId) {
                    whereClause.assignments = {
                        some: {
                            classSubject: {
                                subjectId,
                            },
                        },
                    };
                }
                if (isSupervisor) {
                    whereClause.supervisedClasses = {
                        some: {
                            id: { not: undefined },
                        },
                    };
                }
                if (classId) {
                    whereClause.OR = [
                        { supervisedClasses: { some: { id: classId } } },
                        {
                            assignments: {
                                some: {
                                    classSubject: {
                                        group: {
                                            classes: {
                                                some: {
                                                    id: classId,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ];
                }
                if (search) {
                    const searchCondition = {
                        OR: [
                            {
                                specialization: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                schoolUser: {
                                    user: {
                                        profile: {
                                            lastname: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                schoolUser: {
                                    user: {
                                        profile: {
                                            OR: [
                                                {
                                                    firstname: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                },
                                                {
                                                    lastname: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    };
                    if (day) {
                        whereClause.assignments = {
                            some: {
                                lessons: {
                                    some: {
                                        day,
                                    },
                                },
                            },
                        };
                    }
                    if (whereClause.OR) {
                        whereClause.AND = [
                            { OR: whereClause.OR },
                            searchCondition,
                        ];
                        delete whereClause.OR;
                    }
                    else {
                        const existingAnd = Array.isArray(whereClause.AND)
                            ? whereClause.AND
                            : whereClause.AND
                                ? [whereClause.AND]
                                : [];
                        whereClause.AND = [...existingAnd, searchCondition];
                    }
                }
                const [total, teachers] = await Promise.all([
                    prisma.teacher.count(),
                    prisma.teacher.findMany({
                        where: whereClause,
                        take: limit,
                        skip,
                        orderBy: {
                            schoolUser: {
                                user: {
                                    profile: {
                                        lastname: 'asc',
                                    },
                                },
                            },
                        },
                    }),
                ]);
                return {
                    data: teachers,
                    meta: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                    },
                };
            }
            catch (error) {
                throw (0, api_errors_1.createServiceError)('Erreur lors de la recupération des professeurs', 500, error);
            }
        },
        teacher: async (_, { id }, { user, schoolId, prisma }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const checkedRole = await (0, verify_role_1.checkRole)({
                context: { schoolId, userId: user.id },
                roles: ['TEACHER', 'ADMIN'],
            });
            if (!checkedRole.success) {
                throw (0, api_errors_1.createServiceError)(checkedRole.message || 'Accès refusé à cette école', 403);
            }
            const teacher = await prisma.teacher.findUnique({
                where: { id },
            });
            if (!teacher)
                throw (0, api_errors_1.createServiceError)('Enseignant introuvable', 404);
            return teacher;
        },
        getTeachersForAttendance: async (_, { filter: { attendanceDate, page = 0, limit = 10, search, day } }, { user, prisma, schoolId, membership }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const skip = page * limit;
            let whereClause = {
                assignments: {
                    some: {
                        classSubject: {
                            assignments: {
                                lessons: {
                                    some: {
                                        ...(day && {
                                            day,
                                        }),
                                    },
                                },
                            },
                        },
                    },
                },
            };
            if (search) {
                whereClause.schoolUser = {
                    user: {
                        profile: {
                            OR: [
                                { firstname: { contains: search.trim(), mode: 'insensitive' } },
                                { lastname: { contains: search.trim(), mode: 'insensitive' } },
                            ],
                        },
                    },
                };
            }
            const [teachers, total] = await Promise.all([
                await prisma.teacher.findMany({
                    where: whereClause,
                    take: limit,
                    skip,
                    select: {
                        schoolUserId: true,
                        id: true,
                        assignments: {
                            include: {
                                classSubject: true,
                            },
                        },
                    },
                }),
                await prisma.teacher.count({
                    where: whereClause,
                }),
            ]);
            let lessonWhereClause = {
                schoolId,
                ...(day && {
                    day,
                }),
            };
            const lessons = await prisma.lesson.findMany({
                where: lessonWhereClause,
                include: {
                    teacherAssignment: {
                        include: {
                            teacher: true,
                            classSubject: {
                                include: {
                                    subject: true,
                                    group: true,
                                },
                            },
                        },
                    },
                },
            });
            console.log('Lessons', lessons.map((l) => l));
            return {
                data: lessons.map((l) => ({
                    id: l.teacherAssignment.teacherId,
                    schoolUserId: l.teacherAssignment.teacher.schoolUserId,
                    assignments: lessons.map((l) => l.teacherAssignment.classSubject),
                })),
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        },
    },
};
//# sourceMappingURL=teacher-query.resolver.js.map
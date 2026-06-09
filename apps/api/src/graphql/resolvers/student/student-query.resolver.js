"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentQueryResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
exports.studentQueryResolver = {
    Query: {
        getSchoolStudents: async (_, { input }, { user, schoolId, prisma }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const { page = 0, limit = 10, searchTerm, classId, level, sort, section, teacherId, } = input;
            const roleChecked = await (0, verify_role_1.checkRole)({
                context: { schoolId, userId: user.id },
                roles: ['ADMIN', 'TEACHER'],
            });
            if (!roleChecked.success) {
                throw (0, api_errors_1.createServiceError)(roleChecked.message, 403);
            }
            const skip = page * limit;
            const search = searchTerm?.trim();
            let whereClause = {
                schoolId,
                deletedAt: null,
            };
            if (teacherId) {
                whereClause.schoolClass = {
                    group: {
                        classSubjects: {
                            some: { teacherId },
                        },
                    },
                };
            }
            if (level || section) {
                whereClause.schoolClass = {
                    ...(level && { level }),
                    ...(section !== undefined && { section }),
                };
            }
            if (classId) {
                whereClause = {
                    ...whereClause,
                    ...(classId && { classId }),
                };
            }
            if (search) {
                whereClause.OR = [
                    { matricule: { contains: search, mode: 'insensitive' } },
                    {
                        profile: {
                            OR: [
                                { firstname: { contains: search, mode: 'insensitive' } },
                                { lastname: { contains: search, mode: 'insensitive' } },
                            ],
                        },
                    },
                ];
            }
            let orderBy = {
                profile: {
                    firstname: 'asc',
                },
            };
            if (sort) {
                if (sort?.field === 'lastname' || sort?.field === 'firstname') {
                    orderBy.profile = {
                        [sort.field]: sort.order?.toLowerCase(),
                    };
                }
                if (sort?.field === 'enrolementYear') {
                    orderBy = {
                        ...orderBy,
                        enrollmentYear: sort.order?.toLocaleLowerCase(),
                    };
                }
            }
            const [total, students] = await Promise.all([
                prisma.student.count({ where: whereClause }),
                prisma.student.findMany({
                    where: whereClause,
                    take: limit,
                    skip,
                    orderBy,
                }),
            ]);
            return {
                data: students?.map((s) => ({
                    ...s,
                    status: s.status,
                })),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        },
        searchStudent: async (_, { filter }, { user, prisma }) => {
            const schoolId = filter.schoolId;
            const searchTerm = filter.searchTerm?.trim() || '';
            const limit = filter.limit ?? undefined;
            (0, verify_role_1.checkSchoolId)(schoolId);
            const students = await prisma.student.findMany({
                where: {
                    schoolId,
                    OR: [
                        {
                            profile: {
                                firstname: { contains: searchTerm, mode: 'insensitive' },
                            },
                        },
                        {
                            profile: {
                                lastname: { contains: searchTerm, mode: 'insensitive' },
                            },
                        },
                        { matricule: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                },
                take: limit,
            });
            return students;
        },
        student: async (_, { id }, { user, schoolId, prisma }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            try {
                const checkedRole = await (0, verify_role_1.checkRole)({
                    context: { schoolId, userId: user.id },
                    roles: ['TEACHER', 'ADMIN', 'PARENT'],
                });
                if (!checkedRole.success) {
                    throw (0, api_errors_1.createServiceError)(checkedRole.message || 'Accès refusé', 403);
                }
                return await prisma.student.findUnique({
                    where: { id, schoolId },
                });
            }
            catch (err) {
                throw (0, api_errors_1.createServiceError)(err?.message || 'Erreur lors de la récupération des données', 500);
            }
        },
    },
};
//# sourceMappingURL=student-query.resolver.js.map
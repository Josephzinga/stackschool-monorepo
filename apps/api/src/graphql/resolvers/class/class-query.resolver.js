"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classQueryResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../../utils/api-errors");
const verify_role_1 = require("../../../lib/verify-role");
exports.classQueryResolver = {
    Query: {
        getSchoolClasses: async (_, { input }, { user, schoolId }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const { searchTerm, section, page = 0, limit = 10, teacherId, level, } = input;
            const skip = page * limit;
            const search = searchTerm?.trim();
            let whereClause = { schoolId };
            if (teacherId) {
                whereClause.group = {
                    classSubjects: {
                        some: {
                            assignments: {
                                teacherId,
                            },
                        },
                    },
                };
            }
            if (search) {
                whereClause.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { section: { contains: search, mode: 'insensitive' } },
                    { level: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (level) {
                whereClause.level = {
                    equals: level,
                    mode: 'insensitive',
                };
            }
            if (section) {
                whereClause.section = {
                    equals: section,
                    mode: 'insensitive',
                };
            }
            const [total, classes] = await Promise.all([
                db_1.prisma.class.count({ where: whereClause }),
                db_1.prisma.class.findMany({
                    where: whereClause,
                    take: limit,
                    skip,
                    orderBy: { name: 'asc' },
                }),
            ]);
            return {
                data: classes,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        },
        class: async (_, { id }, { user, schoolId }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            try {
                const checked = await (0, verify_role_1.checkRole)({
                    context: { userId: user.id, schoolId },
                    roles: ['ADMIN', 'TEACHER'],
                });
                if (!checked.success) {
                    throw (0, api_errors_1.createServiceError)(checked.message || 'Permission non accordé.', 403);
                }
                const classData = await db_1.prisma.class.findUnique({
                    where: { id, schoolId },
                });
                if (!classData || classData.schoolId !== schoolId) {
                    throw (0, api_errors_1.createServiceError)('Accès refusé ou classe introuvable', 400);
                }
                return classData;
            }
            catch (e) {
                throw (0, api_errors_1.createServiceError)(e?.message || 'Erreur lors la recupération des classes.');
            }
        },
    },
};
//# sourceMappingURL=class-query.resolver.js.map
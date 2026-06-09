"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentQueryResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../../utils/api-errors");
exports.parentQueryResolver = {
    Query: {
        getSchoolParents: async (_, { filter: { limit = 10, page = 0, searchTerm, studentId } }, { schoolId, user }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement est manquant", 400);
            const search = searchTerm?.trim();
            let whereClause = {
                schoolUser: {
                    schoolId,
                },
            };
            if (searchTerm) {
                whereClause.schoolUser = {
                    schoolId,
                    user: {
                        profile: {
                            OR: [
                                { firstname: { contains: search, mode: 'insensitive' } },
                                { lastname: { contains: search, mode: 'insensitive' } },
                            ],
                        },
                    },
                };
            }
            const [total, parent] = await Promise.all([
                await db_1.prisma.parent.count({ where: whereClause }),
                await db_1.prisma.parent.findMany({
                    where: whereClause,
                    take: limit,
                    skip: limit * page,
                }),
            ]);
            return {
                data: parent,
                meta: {
                    page: page,
                    total,
                    totalPages: Math.ceil(total / limit),
                    limit,
                },
            };
        },
    },
};
//# sourceMappingURL=parent-query.resolver.js.map
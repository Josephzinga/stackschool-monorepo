"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchoolResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../utils/api-errors");
exports.searchSchoolResolver = {
    Query: {
        searchSchool: async (_, { filter }, context) => {
            const { searchTerm } = filter;
            if (!searchTerm || searchTerm.length < 2) {
                throw (0, api_errors_1.createServiceError)('Le terme de la recherche doit contenir au moins 2 caractères', 400);
            }
            try {
                const school = await db_1.prisma.school.findMany({
                    where: {
                        OR: [
                            { name: { contains: searchTerm, mode: 'insensitive' } },
                            { address: { contains: searchTerm, mode: 'insensitive' } },
                            { code: { contains: searchTerm, mode: 'insensitive' } },
                        ],
                        deletedAt: null,
                    },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        slug: true,
                        logo: true,
                        code: true,
                    },
                    take: 10,
                    orderBy: { name: 'desc' },
                });
                return school;
            }
            catch (error) {
                throw (0, api_errors_1.createServiceError)('Erreur de recherche des écoles', 500, error);
            }
        },
    },
};
//# sourceMappingURL=searchSchool.resolver.js.map
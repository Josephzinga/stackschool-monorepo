"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classMutationResolver = void 0;
const api_errors_1 = require("../../../utils/api-errors");
const db_1 = require("@stackschool/db");
const verify_role_1 = require("../../../lib/verify-role");
exports.classMutationResolver = {
    Mutation: {
        createClass: async (_, { data }, { user, schoolId }) => {
            if (!user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant", 400);
            try {
                const adminCheck = await (0, verify_role_1.isAdmin)({
                    context: { schoolId, userId: user.id },
                });
                if (!adminCheck?.success) {
                    throw (0, api_errors_1.createServiceError)(adminCheck?.message || 'Accès refusé', 403);
                }
                const existing = await db_1.prisma.class.findFirst({
                    where: {
                        name: { equals: data.name, mode: 'insensitive' },
                        schoolId,
                    },
                });
                if (existing) {
                    throw (0, api_errors_1.createServiceError)('Une classe avec ce nom existe déjà', 400);
                }
                const group = await db_1.prisma.group.create({
                    data: {
                        schoolId,
                        name: data.name,
                        type: 'SOLO',
                        classes: {
                            create: {
                                name: data.name,
                                level: data.level,
                                section: data.section,
                                schoolId,
                                supervisorId: data.supervisorId || undefined,
                            },
                        },
                    },
                    select: {
                        classes: true,
                    },
                });
                return group.classes[0];
            }
            catch (error) {
                throw (0, api_errors_1.createServiceError)(error?.message || 'Erreur lors de la création', 500, error);
            }
        },
        updateClass: async (_, { classId, data, schoolId }, context) => {
            if (!context.user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            const adminCheck = await (0, verify_role_1.isAdmin)({
                context: { schoolId, userId: context.user.id },
            });
            if (!adminCheck?.success) {
                throw (0, api_errors_1.createServiceError)(adminCheck?.message || 'Accès refusé', 403);
            }
            try {
                const existing = await db_1.prisma.class.findFirst({
                    where: {
                        name: { equals: data.name, mode: 'insensitive' },
                        schoolId,
                        id: { not: classId },
                    },
                });
                if (existing) {
                    throw (0, api_errors_1.createServiceError)('Une classe avec ce nom existe déjà', 400);
                }
                await db_1.prisma.class.update({
                    where: { id: classId },
                    data: {
                        name: data.name,
                        level: data.level,
                        section: data.section,
                        supervisorId: data.supervisorId || null,
                    },
                });
                return { ok: true, message: 'Classe mise à jour avec succès' };
            }
            catch (error) {
                console.error('Erreur update classe:', error);
                if (error.statusCode)
                    throw error;
                throw (0, api_errors_1.createServiceError)('Erreur lors de la mise à jour', 500, error);
            }
        },
        deleteClasses: async (_, { classIds, schoolId }, context) => {
            if (!context.user)
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            const adminCheck = await (0, verify_role_1.isAdmin)({
                context: { schoolId, userId: context.user.id },
            });
            if (!adminCheck?.success) {
                throw (0, api_errors_1.createServiceError)(adminCheck?.message || 'Accès refusé', 403);
            }
            try {
                const count = await db_1.prisma.class.count({
                    where: {
                        id: { in: classIds },
                        schoolId,
                    },
                });
                if (count !== classIds.length) {
                    throw (0, api_errors_1.createServiceError)('Certaines classes sont introuvables ou ne vous appartiennent pas', 404);
                }
                await db_1.prisma.class.deleteMany({
                    where: {
                        id: { in: classIds },
                    },
                });
                return { ok: true, message: `${count} classe(s) supprimée(s)` };
            }
            catch (error) {
                console.error('Erreur suppression classes:', error);
                throw (0, api_errors_1.createServiceError)('Erreur lors de la suppression', 500, error);
            }
        },
    },
};
//# sourceMappingURL=class-mutation.resolver.js.map
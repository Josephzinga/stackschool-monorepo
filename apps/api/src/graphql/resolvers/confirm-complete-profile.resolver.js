"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmCompleteProfileResolver = void 0;
const db_1 = require("@stackschool/db");
const redis_1 = require("../../lib/redis");
const api_errors_1 = require("../../utils/api-errors");
const school_service_1 = require("../../services/complete-profile/school.service");
const role_service_1 = require("../../services/complete-profile/role.service");
const profile_service_1 = require("../../services/complete-profile/profile.service");
const handle_redis_user_1 = require("../../lib/handle-redis-user");
exports.confirmCompleteProfileResolver = {
    Mutation: {
        confirmCompleteProfile: async (_, __, context) => {
            const userId = context.user.id;
            const redisKey = `complete_profile:${userId}`;
            if (!userId) {
                throw (0, api_errors_1.createServiceError)('Utilisateur non authentifié', 401);
            }
            try {
                const cachedData = await redis_1.redisClient.get(redisKey);
                if (!cachedData ||
                    cachedData === 'null' ||
                    cachedData === 'undefined') {
                    return {
                        ok: false,
                        message: 'Aucune donnée de profil trouvée (Session expirée). Veuillez recommencer.',
                    };
                }
                const { school, role, profile } = JSON.parse(cachedData);
                await db_1.prisma.$transaction(async (tx) => {
                    (0, handle_redis_user_1.clearUserFromRedis)(userId);
                    await (0, profile_service_1.handleProfileUpdate)(tx, userId, profile);
                    const schoolId = await (0, school_service_1.handleSchoolCreation)(tx, userId, school, role.role);
                    await (0, role_service_1.handleRoleCreation)(tx, userId, schoolId, role);
                    await tx.user.update({
                        where: { id: userId },
                        data: {
                            profileCompleted: true,
                            hasMembership: true,
                        },
                    });
                });
                await redis_1.redisClient.del(redisKey);
                const user = await db_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        phoneNumber: true,
                        hasMembership: true,
                        profileCompleted: true,
                        profile: {
                            select: {
                                id: true,
                                photo: true,
                                firstname: true,
                                lastname: true,
                                gender: true,
                            },
                        },
                    },
                });
                return {
                    ok: true,
                    message: 'Profil finalisé avec succès',
                    user: user,
                };
            }
            catch (error) {
                console.error(error);
                throw (0, api_errors_1.createServiceError)('Erreur lors de la finalisation du profil', 500, error);
            }
        },
    },
};
//# sourceMappingURL=confirm-complete-profile.resolver.js.map
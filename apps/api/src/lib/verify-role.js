"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.checkRole = void 0;
exports.checkUser = checkUser;
exports.checkSchoolId = checkSchoolId;
const prisma_1 = require("./prisma");
const redis_1 = require("./redis");
const api_errors_1 = require("../utils/api-errors");
const checkRole = async (args) => {
    try {
        const { schoolUserId, context, roles } = args;
        if ((!context?.schoolId || !context?.userId) && !schoolUserId) {
            return { success: false, message: 'Contexte manquant' };
        }
        const cacheKey = context
            ? `membership:${context.schoolId}:${context.userId}`
            : null;
        let membership = null;
        if (cacheKey) {
            const cachedMembership = await redis_1.redisClient.get(cacheKey);
            if (cachedMembership) {
                membership = JSON.parse(cachedMembership);
            }
        }
        if (!membership) {
            membership = await prisma_1.prisma.schoolUser.findUnique({
                where: schoolUserId
                    ? { id: schoolUserId }
                    : {
                        schoolId_userId: {
                            schoolId: context.schoolId,
                            userId: context.userId,
                        },
                    },
                include: {
                    teacher: {
                        select: { id: true },
                    },
                },
            });
            if (cacheKey && membership) {
                await redis_1.redisClient.set(cacheKey, JSON.stringify(membership), {
                    expiration: { type: 'EX', value: 600 },
                });
            }
            else if (cacheKey && !membership) {
                await redis_1.redisClient.set(cacheKey, JSON.stringify(null), {
                    expiration: { type: 'EX', value: 60 },
                });
            }
        }
        else if (membership === null) {
            return {
                success: false,
                message: "Accès refusé : vous n'êtes pas membre de cette école.",
            };
        }
        if (!membership) {
            return {
                success: false,
                message: "Accès refusé : vous n'êtes pas membre de cette école.",
            };
        }
        if (membership.isOwner) {
            return { success: true, member: membership };
        }
        if (roles.includes(membership.role)) {
            return { success: true, member: membership };
        }
        return {
            success: false,
            message: `Accès refusé : rôle requis ${roles.join(' ou ')}.`,
        };
    }
    catch (err) {
        console.error('Erreur checkRole:', err);
        return {
            success: false,
            message: 'Erreur interne du serveur lors de la vérification des droits.',
        };
    }
};
exports.checkRole = checkRole;
const isAdmin = async (args) => {
    const result = await (0, exports.checkRole)({
        ...args,
        roles: ['ADMIN'],
    });
    return {
        success: result.success,
        message: result.message,
    };
};
exports.isAdmin = isAdmin;
function checkUser(user) {
    if (!user)
        throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
}
function checkSchoolId(schoolId) {
    if (!schoolId) {
        throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant", 400);
    }
}
//# sourceMappingURL=verify-role.js.map
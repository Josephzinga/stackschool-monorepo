"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const prisma_1 = require("./prisma");
const api_errors_1 = require("../utils/api-errors");
const isAdmin = async (args) => {
    try {
        const { schoolUserId, context } = args;
        if ((!args.context?.schoolId || !args.context?.userId) &&
            !args.schoolUserId)
            return;
        const membership = await prisma_1.prisma.schoolUser.findUnique({
            where: schoolUserId
                ? { id: schoolUserId }
                : {
                    schoolId_userId: {
                        schoolId: context?.schoolId,
                        userId: context?.userId,
                    },
                },
        });
        if (membership && (membership.role === 'ADMIN' || membership.isOwner)) {
            return {
                success: true,
            };
        }
        return {
            success: false,
            message: "Accès refusé : vous n'êtes pas administrateur de cette école.",
        };
    }
    catch (err) {
        (0, api_errors_1.createServiceError)('Erreur de vérification admin', 500, err);
        return {
            success: false,
            message: 'Erreur interne du serveur.',
        };
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=verify-admin.js.map
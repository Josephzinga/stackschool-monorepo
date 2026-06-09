"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../utils/api-errors");
exports.meResolver = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user || !context.user.id) {
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            }
            try {
                const user = await db_1.prisma.user.findUnique({
                    where: { id: context.user.id },
                    include: {
                        profile: true,
                        memberships: {
                            include: {
                                school: {
                                    select: {
                                        id: true,
                                        name: true,
                                        logo: true,
                                        slug: true,
                                        address: true,
                                    },
                                },
                                student: { select: { id: true } },
                                teacher: { select: { id: true } },
                                Parent: { select: { id: true } },
                                Staff: { select: { id: true } },
                            },
                        },
                    },
                });
                if (!user) {
                    throw (0, api_errors_1.createServiceError)('Utilisateur introuvable', 404);
                }
                return user;
            }
            catch (error) {
                console.error('Erreur getMe:', error);
                throw (0, api_errors_1.createServiceError)('Erreur lors de la récupération du profil', 500, error);
            }
        },
    },
    User: {
        schoolContext: async (parent, args, context) => {
            const { schoolId } = args;
            const userId = parent.id;
            const membership = await db_1.prisma.schoolUser.findUnique({
                where: {
                    schoolId_userId: { schoolId, userId },
                },
                include: {
                    school: true,
                    teacher: { include: { supervisedClasses: true } },
                    student: { include: { schoolClass: true } },
                    Parent: {
                        include: {
                            students: {
                                include: {
                                    student: { include: { profile: true, schoolClass: true } },
                                },
                            },
                        },
                    },
                    Staff: true,
                },
            });
            if (!membership) {
                throw (0, api_errors_1.createServiceError)("Vous n'êtes pas membre de cette école.", 403);
            }
            return {
                id: membership.id,
                role: membership.role,
                school: membership.school,
                teacher: membership.teacher,
                student: membership.student,
                parent: membership.Parent,
                staff: membership.Staff,
            };
        },
        profile: async (parent) => {
            return db_1.prisma.profile.findUnique({
                where: {
                    userId: parent.id,
                },
            });
        },
    },
};
//# sourceMappingURL=me.resolver.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../utils/api-errors");
const verify_role_1 = require("../../lib/verify-role");
exports.groupResolver = {
    Mutation: {
        createGroup: async (_, { input: { name, classIds } }, { user, schoolId }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const adminCheck = await (0, verify_role_1.isAdmin)({
                context: { schoolId, userId: user.id },
            });
            if (!adminCheck?.success) {
                throw (0, api_errors_1.createServiceError)(adminCheck?.message || 'Accès refusé', 403);
            }
            const group = await db_1.prisma.group.create({
                data: {
                    name,
                    schoolId,
                    classes: {
                        connect: classIds.map((cls) => ({
                            id: cls,
                        })),
                    },
                },
            });
            return group;
        },
    },
    Group: {
        classSubjects: async (parent, _args, { loaders }) => {
            return await loaders.classSubjectByGroupLoader.load(parent.id);
        },
        classes: async (parent, _args, { loaders }) => {
            return await loaders.classByGroupLoader.load(parent.id);
        },
    },
};
//# sourceMappingURL=groups.resolver.js.map
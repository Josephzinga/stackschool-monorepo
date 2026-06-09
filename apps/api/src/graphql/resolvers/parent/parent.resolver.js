"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentResolver = void 0;
const db_1 = require("@stackschool/db");
exports.parentResolver = {
    Parent: {
        parentStudent: async (parent) => db_1.prisma.parentStudent.findMany({
            where: {
                parentId: parent.id,
            },
        }),
        user: async (parent, _, { schoolId }) => {
            if (!parent.schoolUserId)
                return null;
            const user = await db_1.prisma.user.findFirst({
                where: {
                    memberships: {
                        some: {
                            schoolId: schoolId ?? undefined,
                            id: parent.schoolUserId,
                        },
                    },
                },
            });
            return user;
        },
    },
    ParentStudent: {
        student: async (parent) => {
            if (!parent.studentId)
                return null;
            return db_1.prisma.student.findUnique({
                where: {
                    id: parent.studentId,
                },
            });
        },
        parent: async (parent) => {
            if (!parent.parentId)
                return null;
            return db_1.prisma.parent.findUnique({
                where: {
                    id: parent.parentId,
                },
            });
        },
    },
};
//# sourceMappingURL=parent.resolver.js.map
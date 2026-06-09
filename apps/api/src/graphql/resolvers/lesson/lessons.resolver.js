"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonsResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../../utils/api-errors");
exports.lessonsResolver = {
    ClassTeacher: {
        teacher: async (parent, _, { schoolId }) => {
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant");
            const teachers = await db_1.prisma.teacher.findMany({
                where: {
                    schoolUser: {
                        schoolId,
                    },
                },
            });
            return teachers;
        },
        classes: async (parent, _, { schoolId }) => {
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant");
            return db_1.prisma.class.findMany({
                where: {
                    schoolId,
                },
            });
        },
        groups: async (parent, _, { schoolId }) => {
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant");
            return db_1.prisma.group.findMany({
                where: {
                    schoolId,
                },
            });
        },
    },
    Lesson: {
        teacherAssignment: async (parent, _, { schoolId }) => {
            if (!schoolId)
                throw (0, api_errors_1.createServiceError)("Identifiant de l'établissement manquant");
            return db_1.prisma.teacherAssignment.findFirst({
                where: {
                    schoolId,
                    lessons: {
                        some: {
                            id: parent.id,
                        },
                    },
                },
            });
        },
    },
};
//# sourceMappingURL=lessons.resolver.js.map
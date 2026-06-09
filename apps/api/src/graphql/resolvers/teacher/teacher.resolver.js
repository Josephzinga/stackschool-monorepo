"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherResolver = void 0;
const lesson_get_hours_1 = require("../../../utils/lesson-get-hours");
exports.teacherResolver = {
    Teacher: {
        weeklyHours: async (parent, _args, { loaders }) => {
            const lessons = await loaders.lessonsByTeacherLoader.load(parent.id);
            return (0, lesson_get_hours_1.getWeeklyHours)(lessons);
        },
        user: async (parent, _, { loaders }) => {
            if (!parent.schoolUserId)
                return null;
            return await loaders.userLoader.load(parent.schoolUserId);
        },
        assignments: async (parent, _, { loaders }) => {
            return (await loaders.assignmentsByTeacherLoader.load(parent.id)) || [];
        },
    },
};
//# sourceMappingURL=teacher.resolver.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonQueryResolver = void 0;
const verify_role_1 = require("../../../lib/verify-role");
const _1 = require(".");
const lesson_get_hours_1 = require("../../../utils/lesson-get-hours");
exports.lessonQueryResolver = {
    Query: {
        getLessons: async (parent, { filter }, { user, schoolId }) => {
            (0, verify_role_1.checkUser)(user);
            (0, verify_role_1.checkSchoolId)(schoolId);
            const { mode = 'CLASS', teacherId, groupId, classId, hasLessonOnly, status, page = 0, limit = 6, } = filter;
            const skip = page * limit;
            let teachers = [];
            let groups = [];
            let totalCount = 0;
            if (mode === 'TEACHER') {
                const teacherWhere = (0, _1.teacherWhereClause)(filter, schoolId);
                teachers = await (0, _1.fetchTeachers)(teacherWhere, skip, limit);
                totalCount = teachers.length;
            }
            else {
                const groupWhere = (0, _1.groupWhereClause)(filter, schoolId);
                const result = await (0, _1.fetchGroups)(groupWhere, skip, limit);
                groups = result.groups;
                totalCount = result.totalCount;
            }
            const teacherIds = teachers.map((t) => t.id);
            const groupIds = groups.map((g) => g.id);
            const lessons = await (0, _1.fetchLessons)(schoolId, mode, teacherIds, groupIds, status ?? undefined);
            const weeklyHours = lessons.filter((l) => { });
            const events = lessons.map((lesson) => (0, _1.transformLessonToEvent)(lesson, mode));
            const resources = mode === 'TEACHER'
                ? teachers.map((t) => ({
                    id: t.id,
                    title: `${t.schoolUser.user.profile?.firstname} ${t.schoolUser.user.profile?.lastname}`,
                    weeklyHours: (0, lesson_get_hours_1.getWeeklyHours)(lessons.filter((l) => l.teacherAssignmentId === t.id)),
                }))
                : groups.map((g) => ({
                    id: g.id,
                    title: g.type === 'SOLO' ? g.classes[0]?.name : g.name,
                }));
            return {
                data: { events, resources },
                meta: {
                    total: totalCount,
                    page,
                    totalPages: Math.ceil(totalCount / limit),
                    limit,
                },
            };
        },
    },
};
//# sourceMappingURL=lesson-query.resolver.js.map
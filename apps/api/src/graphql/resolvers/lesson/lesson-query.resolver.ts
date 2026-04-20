import { Resolvers } from '../../types.generated';
import { checkSchoolId, checkUser } from '../../../lib/verify-role';
import {
  fetchGroups,
  fetchLessons,
  fetchTeachers,
  groupWhereClause,
  teacherWhereClause,
  transformLessonToEvent,
} from '.';
import { getWeeklyHours } from '../../../utils/lesson-get-hours';

export const lessonQueryResolver: Resolvers = {
  Query: {
    getLessons: async (parent, { filter }, { user, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);

      const {
        mode = 'CLASS',
        teacherId,
        groupId,
        classId,
        hasLessonOnly,
        status,
        page = 0,
        limit = 6,
      } = filter;

      const skip = page * limit;
      let teachers: any[] = [];
      let groups: any[] = [];
      let totalCount = 0;

      // Récupération des ressources (enseignants ou groupes)
      if (mode === 'TEACHER') {
        const teacherWhere = teacherWhereClause(filter, schoolId);
        teachers = await fetchTeachers(teacherWhere, skip, limit);
        totalCount = teachers.length;
      } else {
        const groupWhere = groupWhereClause(filter, schoolId);
        const result = await fetchGroups(groupWhere, skip, limit);
        groups = result.groups;
        totalCount = result.totalCount;
      }

      // Récupération des leçons
      const teacherIds = teachers.map((t) => t.id);
      const groupIds = groups.map((g) => g.id);
      const lessons = await fetchLessons(
        schoolId,
        mode,
        teacherIds,
        groupIds,
        status ?? undefined,
      );
      const weeklyHours = lessons.filter((l) => {});

      const events = lessons.map((lesson) =>
        transformLessonToEvent(lesson, mode),
      );
      const resources =
        mode === 'TEACHER'
          ? teachers.map((t) => ({
              id: t.id,
              title: `${t.schoolUser.user.profile?.firstname} ${t.schoolUser.user.profile?.lastname}`,
              weeklyHours: getWeeklyHours(
                lessons.filter((l) => l.teacherAssignmentId === t.id),
              ),
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

import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';

export const schoolResolver: Resolvers = {
  Query: {
    schoolStats: async (_: any, { schoolId }, context: any) => {
      const userId = context.user.id;

      if (!userId) {
        throw createServiceError('Non authentifié', 401);
      }

      const membership = await prisma.schoolUser.findUnique({
        where: {
          schoolId_userId: { schoolId, userId },
        },
        include: {
          school: true,
        },
      });

      if (!membership) {
        throw createServiceError('Accès refusé à cette école', 403);
      }

      return membership.school as any;
    },
  },

  School: {
    stats: async (parent) => {
      const schoolId = parent.id!;

      const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
        prisma.student.count({ where: { schoolId } }),
        prisma.teacher.count({ where: { schoolUser: { schoolId } } }),
        prisma.class.count({ where: { schoolId } }),
      ]);

      const genderCounts = await prisma.profile.groupBy({
        by: ['gender'],
        where: {
          student: {
            some: {
              schoolId: schoolId,
            },
          },
        },
        _count: {
          id: true,
        },
      });

      const maleCount =
        genderCounts.find((g) => g.gender === 'MALE')?._count.id || 0;
      const femaleCount =
        genderCounts.find((g) => g.gender === 'FEMALE')?._count.id || 0;
      const otherCount =
        genderCounts.find((g) => g.gender === 'OTHER')?._count.id || 0;

      const studentGender = {
        male: maleCount,
        female: femaleCount,
        other: otherCount,
      };

      const classesOccupancy = await prisma.class.findMany({
        where: { schoolId },
        select: {
          name: true,
          _count: {
            select: { students: true },
          },
        },
      });

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        studentGender,
        classesOccupancy: classesOccupancy.map((c) => ({
          className: c.name,
          studentCount: c._count.students,
        })),
        monthlyRevenue: 0,
        pendingPaymentsCount: 0,
        todayAttendanceRate: 0,
        absentTodayCount: 0,
        enrollmentPerMonth: [],
      };
    },
  },
};

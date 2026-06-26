import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';
import {
  addMonths,
  endOfDay,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { isAdmin, checkUser } from '../../lib/verify-role';

export const schoolResolver: Resolvers = {
  Query: {
    school: async (_: any, { schoolId }, { prisma, user }) => {
      checkUser(user);

      const userId = user.id;

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
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const startCurrentMonth = startOfMonth(today);
      const startNextMonth = addMonths(startCurrentMonth, 1);
      const previousMonth = subMonths(startCurrentMonth, 1);

      const currentRevenue = await prisma.payment.aggregate({
        where: {
          schoolId,
          createdAt: {
            gte: startCurrentMonth,
            lt: startNextMonth,
          },
        },
        _sum: {
          netAmount: true,
        },
      });
      const previousRevenue = await prisma.payment.aggregate({
        where: {
          schoolId,
          createdAt: {
            gte: previousMonth,
            lt: startCurrentMonth,
          },
        },
        _sum: {
          netAmount: true,
        },
      });

      const monthlyRevenue = {
        currentMonth: currentRevenue?._sum.netAmount || 0,
        previousMonth: previousRevenue?._sum.netAmount || 0,
      };

      const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
        prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
        prisma.teacher.count({ where: { schoolUser: { schoolId } } }),
        prisma.class.count({ where: { schoolId } }),
      ]);
      // --- Calcul Présence (Aujourd'hui) ---
      const todayAttendances = await prisma.attendance.groupBy({
        by: ['status'],
        where: {
          schoolId,
          date: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        _count: { id: true },
      });

      const presentCount =
        todayAttendances.find((a) => a.status === 'PRESENT')?._count.id || 0;
      const absentCount =
        todayAttendances.find((a) => a.status === 'ABSENT')?._count.id || 0;
      const lateCount =
        todayAttendances.find((a) => a.status === 'LATE')?._count.id || 0;
      const totalRecorded = presentCount + absentCount + lateCount;

      const attendanceRate =
        totalRecorded > 0
          ? ((presentCount + lateCount) / totalRecorded) * 100
          : 0;

      // --- Calcul Historique Présence (7 derniers jours) ---
      const last7Days = subDays(today, 7);
      const historyAttendances = await prisma.attendance.findMany({
        where: {
          schoolId,
          date: { gte: last7Days },
        },
        select: { date: true, status: true },
      });

      const historyMap = new Map();
      historyAttendances.forEach((att) => {
        const dateKey = format(att.date, 'yyyy-MM-dd');
        if (!historyMap.has(dateKey)) {
          historyMap.set(dateKey, { present: 0, absent: 0, late: 0, total: 0 });
        }
        const entry = historyMap.get(dateKey);
        entry.total++;
        if (att.status === 'PRESENT') entry.present++;
        if (att.status === 'ABSENT') entry.absent++;
        if (att.status === 'LATE') entry.late++;
      });

      const history = Array.from(historyMap.entries())
        .map(([date, stats]) => ({
          date,
          present: stats.present,
          absent: stats.absent,
          late: stats.late,
          rate:
            stats.total > 0
              ? ((stats.present + stats.late) / stats.total) * 100
              : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // --- Calcul Genre ---
      const students = await prisma.student.findMany({
        where: { schoolId },
        select: { profile: { select: { gender: true } } },
      });

      const maleCount = students.filter(
        (s) => s.profile.gender === 'MALE',
      ).length;
      const femaleCount = students.filter(
        (s) => s.profile.gender === 'FEMALE',
      ).length;

      const studentGender = {
        male: maleCount,
        female: femaleCount,
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
        attendance: {
          rate: parseFloat(attendanceRate.toFixed(1)),
          presentCount,
          absentCount,
          lateCount,
          totalExpected: totalStudents,
          history,
        },
        monthlyRevenue,
        pendingPaymentsCount: 0,
        enrollmentPerMonth: [],
      };
    },
    settings: async (parent, _, { prisma }) => {
      const settings = await prisma.schoolSettings.findUnique({
        where: {
          schoolId: parent.id!,
        },
      });
      return settings;
    },
  },
  SchoolMembership: {
    teacher: async (parent, _args, { prisma, user }) => {
      return prisma.teacher.findFirst({
        where: {
          schoolUserId: parent.id,
        },
      });
    },

    staff: async (parent, _args, { prisma }) => {
      return prisma.staff.findFirst({
        where: {
          schoolUserId: parent.id,
        },
      });
    },

    parent: async (p, _args, { prisma }) => {
      return prisma.parent.findFirst({
        where: {
          schoolUserId: p.id,
        },
      });
    },
    permissions: async (parent, _args, { loaders }) => {
      return (await loaders.permissionsLoader.load(parent.id)) || [];
    },
  },
};

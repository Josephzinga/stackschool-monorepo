"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolResolver = void 0;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../../utils/api-errors");
const date_fns_1 = require("date-fns");
const verify_role_1 = require("../../lib/verify-role");
exports.schoolResolver = {
    Query: {
        school: async (_, { schoolId }, context) => {
            const userId = context?.user.id;
            if (!userId) {
                throw (0, api_errors_1.createServiceError)('Non authentifié', 401);
            }
            const membership = await db_1.prisma.schoolUser.findUnique({
                where: {
                    schoolId_userId: { schoolId, userId },
                },
                include: {
                    school: true,
                },
            });
            if (!membership) {
                throw (0, api_errors_1.createServiceError)('Accès refusé à cette école', 403);
            }
            return membership.school;
        },
    },
    School: {
        stats: async (parent) => {
            const schoolId = parent.id;
            const today = new Date();
            const startOfToday = (0, date_fns_1.startOfDay)(today);
            const endOfToday = (0, date_fns_1.endOfDay)(today);
            const startCurrentMonth = (0, date_fns_1.startOfMonth)(today);
            const startNextMonth = (0, date_fns_1.addMonths)(startCurrentMonth, 1);
            const previousMonth = (0, date_fns_1.subMonths)(startCurrentMonth, 1);
            const currentRevenue = await db_1.prisma.payment.aggregate({
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
            const previousRevenue = await db_1.prisma.payment.aggregate({
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
                db_1.prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
                db_1.prisma.teacher.count({ where: { schoolUser: { schoolId } } }),
                db_1.prisma.class.count({ where: { schoolId } }),
            ]);
            const todayAttendances = await db_1.prisma.attendance.groupBy({
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
            const presentCount = todayAttendances.find((a) => a.status === 'PRESENT')?._count.id || 0;
            const absentCount = todayAttendances.find((a) => a.status === 'ABSENT')?._count.id || 0;
            const lateCount = todayAttendances.find((a) => a.status === 'LATE')?._count.id || 0;
            const totalRecorded = presentCount + absentCount + lateCount;
            const attendanceRate = totalRecorded > 0
                ? ((presentCount + lateCount) / totalRecorded) * 100
                : 0;
            const last7Days = (0, date_fns_1.subDays)(today, 7);
            const historyAttendances = await db_1.prisma.attendance.findMany({
                where: {
                    schoolId,
                    date: { gte: last7Days },
                },
                select: { date: true, status: true },
            });
            const historyMap = new Map();
            historyAttendances.forEach((att) => {
                const dateKey = (0, date_fns_1.format)(att.date, 'yyyy-MM-dd');
                if (!historyMap.has(dateKey)) {
                    historyMap.set(dateKey, { present: 0, absent: 0, late: 0, total: 0 });
                }
                const entry = historyMap.get(dateKey);
                entry.total++;
                if (att.status === 'PRESENT')
                    entry.present++;
                if (att.status === 'ABSENT')
                    entry.absent++;
                if (att.status === 'LATE')
                    entry.late++;
            });
            const history = Array.from(historyMap.entries())
                .map(([date, stats]) => ({
                date,
                present: stats.present,
                absent: stats.absent,
                late: stats.late,
                rate: stats.total > 0
                    ? ((stats.present + stats.late) / stats.total) * 100
                    : 0,
            }))
                .sort((a, b) => a.date.localeCompare(b.date));
            const students = await db_1.prisma.student.findMany({
                where: { schoolId },
                select: { profile: { select: { gender: true } } },
            });
            const maleCount = students.filter((s) => s.profile.gender === 'MALE').length;
            const femaleCount = students.filter((s) => s.profile.gender === 'FEMALE').length;
            const studentGender = {
                male: maleCount,
                female: femaleCount,
            };
            const classesOccupancy = await db_1.prisma.class.findMany({
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
        settings: async (parent, _, { user }) => {
            if (!parent.id)
                return null;
            const checked = await (0, verify_role_1.isAdmin)({
                context: { schoolId: parent.id, userId: user.id },
            });
            if (!checked.success) {
                throw (0, api_errors_1.createServiceError)(checked.message || 'Accès non autoriser', 403);
            }
            const settings = await db_1.prisma.schoolSettings.findUnique({
                where: {
                    schoolId: parent.id,
                },
            });
            return settings;
        },
    },
};
//# sourceMappingURL=school.resolver.js.map
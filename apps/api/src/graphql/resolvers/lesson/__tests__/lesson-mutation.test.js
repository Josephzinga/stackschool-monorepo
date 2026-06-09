"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lesson_mutation_resolver_1 = require("../lesson-mutation.resolver");
const db_1 = require("@stackschool/db");
const verify_role_1 = require("../../../../lib/verify-role");
const shared_1 = require("@stackschool/shared");
const date_fns_1 = require("date-fns");
const globals_1 = require("@jest/globals");
globals_1.jest.mock('@stackschool/db', () => ({
    prisma: {
        classSubjects: {
            findFirst: globals_1.jest.fn(),
        },
        lesson: {
            findMany: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            findUnique: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
        },
    },
}));
globals_1.jest.mock('../../../../lib/verify-role', () => ({
    checkRole: globals_1.jest.fn(),
    isAdmin: globals_1.jest.fn(),
}));
const mockPrisma = db_1.prisma;
const mockCheckRole = verify_role_1.checkRole;
(0, globals_1.describe)('Lesson Mutations', () => {
    const mockUserId = 'clp0abc1234537090abcdefgh';
    const mockSchoolId = 'clp0abc1234567890abcdefgh';
    const mockTeacherId = 'clp0teacher1234567890abc';
    const mockClassId = 'clp0abc1234567890abcdtfgl';
    const mockSubjectId = 'clp0abc3234567890abcdtfgl';
    const mockClassSubjectId = 'clp0abc1234567890arcdtfgl';
    const mockContext = {
        user: { id: mockUserId, email: 'admin@example.com' },
        schoolId: mockSchoolId,
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockCheckRole.mockResolvedValue({
            success: true,
            member: { role: 'ADMIN', teacher: { id: mockTeacherId } },
        });
    });
    (0, globals_1.describe)('createLesson', () => {
        (0, globals_1.it)('should create a lesson successfully as ADMIN', async () => {
            mockPrisma.classSubjects.findFirst.mockResolvedValue({
                id: mockClassSubjectId,
                subjectId: mockClassSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                weeklyHours: null,
                coefficient: 0,
            });
            mockPrisma.lesson.findMany.mockResolvedValue([]);
            mockPrisma.lesson.create.mockResolvedValue({
                id: 'lesson-001',
                title: 'Maths Lesson',
                startTime: (0, date_fns_1.parse)('MONDAY 08:00', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                endTime: (0, date_fns_1.parse)('MONDAY 09:00', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                day: 'MONDAY',
                schoolId: mockSchoolId,
                classSubject: { teacherId: mockTeacherId },
                status: shared_1.LessonStatusEnum.PLANNED,
                subtitle: null,
                roomId: null,
                createdAt: (0, date_fns_1.parse)('MONDAY 08:00', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                updatedAt: undefined,
            });
            const input = {
                title: 'Maths Lesson',
                startTime: '09:00',
                endTime: '10:00',
                day: 'MONDAY',
                subjectId: mockSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                mode: 'CLASS',
            };
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.createLesson({}, { input }, mockContext);
            (0, globals_1.expect)(result).toHaveProperty('id', 'lesson-001');
            (0, globals_1.expect)(mockPrisma.lesson.create).toHaveBeenCalledTimes(1);
            (0, globals_1.expect)(mockCheckRole).toHaveBeenCalledWith({
                context: { userId: mockUserId, schoolId: mockSchoolId },
                roles: ['TEACHER', 'ADMIN'],
            });
        });
        (0, globals_1.it)('should prevent a TEACHER from creating a lesson for another teacher', async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
            });
            const input = {
                title: 'Maths Lesson',
                startTime: '08:00',
                endTime: '09:00',
                day: 'MONDAY',
                subjectId: mockSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                mode: 'CLASS',
            };
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.createLesson({}, { input }, mockContext)).rejects.toThrow('Vous ne pouvez pas créer une leçon pour un autre professeur');
            (0, globals_1.expect)(mockPrisma.lesson.create).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should throw an error if there is a time conflict', async () => {
            mockPrisma.classSubjects.findFirst.mockResolvedValue({
                id: mockClassSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                weeklyHours: null,
                coefficient: 0,
                subjectId: '',
            });
            mockPrisma.lesson.findMany.mockResolvedValue([
                {
                    startTime: (0, date_fns_1.parse)('MONDAY 08:30', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                    endTime: (0, date_fns_1.parse)('MONDAY 09:30', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                    id: '',
                    schoolId: mockSchoolId,
                    title: null,
                    subtitle: null,
                    status: 'PLANNED',
                    day: 'MONDAY',
                    roomId: null,
                    classSubjectId: mockClassSubjectId,
                    createdAt: undefined,
                    updatedAt: undefined,
                },
            ]);
            const input = {
                title: 'Maths Lesson',
                startTime: '08:00',
                endTime: '09:00',
                day: 'MONDAY',
                subjectId: mockSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                mode: 'CLASS',
            };
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.createLesson({}, { input }, mockContext)).rejects.toThrow(/Conflit d'horaire/);
            (0, globals_1.expect)(mockPrisma.lesson.create).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should throw an error if assignation is not found', async () => {
            mockPrisma.classSubjects.findFirst.mockResolvedValue(null);
            const input = {
                title: 'Maths Lesson',
                startTime: '08:00',
                endTime: '09:00',
                day: 'MONDAY',
                subjectId: mockSubjectId,
                teacherId: mockTeacherId,
                groupId: mockClassId,
                mode: 'CLASS',
            };
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.createLesson({}, { input }, mockContext)).rejects.toThrow('Assignation (matière/classe/prof) introuvable');
            (0, globals_1.expect)(mockPrisma.lesson.create).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('updateLessonStatus', () => {
        const mockLessonId = 'lesson-001';
        const mockClassSubjectTeacherId = 'teacher-456';
        (0, globals_1.beforeEach)(() => {
            mockPrisma.lesson.findUnique.mockResolvedValue({
                id: mockLessonId,
                status: shared_1.LessonStatusEnum.PLANNED,
                classSubject: { teacherId: mockTeacherId },
                title: null,
                subtitle: null,
                startTime: (0, date_fns_1.parse)('MONDAY 08:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                endTime: (0, date_fns_1.parse)('MONDAY 10:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                schoolId: mockSchoolId,
                roomId: '',
                createdAt: (0, date_fns_1.parse)('MONDAY 08:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                updatedAt: undefined,
            });
            mockPrisma.lesson.update.mockResolvedValue({
                id: mockLessonId,
                status: shared_1.LessonStatusEnum.PLANNED,
                title: null,
                subtitle: null,
                startTime: (0, date_fns_1.parse)('MONDAY 08:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                endTime: (0, date_fns_1.parse)('MONDAY 10:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                schoolId: mockSchoolId,
                roomId: '',
                classSubject: { teacherId: mockTeacherId },
                createdAt: (0, date_fns_1.parse)('MONDAY 08:00 ', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                updatedAt: undefined,
            });
        });
        (0, globals_1.it)('should update lesson status successfully as ADMIN', async () => {
            const result = lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLessonStatus({}, { id: mockLessonId, status: 'ONGOING' }, mockContext);
            (0, globals_1.expect)(result).toHaveProperty('status', 'ONGOING');
            (0, globals_1.expect)(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)('should update lesson status successfully as TEACHER for their own lesson', async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
            });
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLessonStatus({}, { id: mockLessonId, status: 'ONGOING' }, mockContext);
            (0, globals_1.expect)(result).toHaveProperty('status', 'ONGOING');
            (0, globals_1.expect)(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)("should prevent a TEACHER from updating status of another teacher's lesson", async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
            });
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLessonStatus({}, { id: mockLessonId, status: 'ONGOING' }, mockContext)).rejects.toThrow("Vous n'êtes pas autorisé à modifier le statut de cette leçon");
            (0, globals_1.expect)(mockPrisma.lesson.update).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should throw an error for invalid status transition', async () => {
            mockPrisma.lesson.findUnique.mockResolvedValue({
                id: mockLessonId,
                status: 'COMPLETED',
                classSubjectId: mockClassSubjectId,
                createdAt: undefined,
                updatedAt: undefined,
                schoolId: '',
                title: null,
                subtitle: null,
                startTime: undefined,
                day: 'MONDAY',
                endTime: undefined,
                roomId: null,
            });
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLessonStatus({}, { id: mockLessonId, status: 'ONGOING' }, mockContext)).rejects.toThrow(/Transition de statut impossible/);
            (0, globals_1.expect)(mockPrisma.lesson.update).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('updateLesson', () => {
        const mockLessonId = 'lesson-001';
        const mockClassSubjectTeacherId = 'teacher-456';
        const mockClassSubjectGroupId = 'group-123';
        (0, globals_1.beforeEach)(() => {
            mockPrisma.lesson.findUnique.mockResolvedValue({
                id: mockLessonId,
                title: 'Old Title',
                startTime: (0, date_fns_1.parse)('MONDAY 08:00', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                endTime: (0, date_fns_1.parse)('MONDAY 09:00', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                day: 'MONDAY',
                schoolId: mockSchoolId,
                classSubject: {
                    teacherId: mockClassSubjectTeacherId,
                    groupId: mockClassSubjectGroupId,
                },
            });
            mockPrisma.lesson.update.mockResolvedValue({
                id: mockLessonId,
                title: 'New Title',
            });
            mockPrisma.lesson.findFirst.mockResolvedValue(null);
        });
        (0, globals_1.it)('should update lesson successfully as ADMIN', async () => {
            const input = {
                id: mockLessonId,
                title: 'New Title',
                startTime: '08:30',
                endTime: '09:30',
                day: 'MONDAY',
            };
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLesson({}, { input }, mockContext);
            (0, globals_1.expect)(result).toHaveProperty('title', 'New Title');
            (0, globals_1.expect)(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)('should update lesson successfully as TEACHER for their own lesson', async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
            });
            const input = {
                id: mockLessonId,
                title: 'New Title',
            };
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLesson({}, { input }, mockContext);
            (0, globals_1.expect)(result).toHaveProperty('title', 'New Title');
            (0, globals_1.expect)(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)("should prevent a TEACHER from updating another teacher's lesson", async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
            });
            const input = {
                id: mockLessonId,
                title: 'New Title',
            };
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLesson({}, { input }, mockContext)).rejects.toThrow("Vous n'êtes pas autorisé à modifier cette leçon");
            (0, globals_1.expect)(mockPrisma.lesson.update).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('should throw an error if there is a time conflict during update', async () => {
            mockPrisma.lesson.findFirst.mockResolvedValue({
                id: 'conflicting-lesson',
                startTime: (0, date_fns_1.parse)('MONDAY 08:45', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
                endTime: (0, date_fns_1.parse)('MONDAY 09:45', 'EEEE HH:mm', shared_1.REFERENCE_DATE),
            });
            const input = {
                id: mockLessonId,
                startTime: '08:30',
                endTime: '09:30',
                day: 'MONDAY',
            };
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.updateLesson({}, { input }, mockContext)).rejects.toThrow('Conflit détecté : la classe ou le professeur est déjà occupé sur ce créneau');
            (0, globals_1.expect)(mockPrisma.lesson.update).not.toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)('deleteLesson', () => {
        const mockLessonId = 'lesson-001';
        const mockClassSubjectTeacherId = 'teacher-456';
        (0, globals_1.beforeEach)(() => {
            mockPrisma.lesson.findUnique.mockResolvedValue({
                id: mockLessonId,
                schoolId: mockSchoolId,
                classSubject: { teacherId: mockClassSubjectTeacherId },
            });
            mockPrisma.lesson.delete.mockResolvedValue({ id: mockLessonId });
        });
        (0, globals_1.it)('should delete lesson successfully as ADMIN', async () => {
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.deleteLesson({}, { id: mockLessonId }, mockContext);
            (0, globals_1.expect)(result).toEqual({
                ok: true,
                message: 'Leçon supprimée avec succès.',
            });
            (0, globals_1.expect)(mockPrisma.lesson.delete).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)('should delete lesson successfully as TEACHER for their own lesson', async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
            });
            const result = await lesson_mutation_resolver_1.lessonMutationResolver.Mutation.deleteLesson({}, { id: mockLessonId }, mockContext);
            (0, globals_1.expect)(result).toEqual({
                ok: true,
                message: 'Leçon supprimée avec succès.',
            });
            (0, globals_1.expect)(mockPrisma.lesson.delete).toHaveBeenCalledTimes(1);
        });
        (0, globals_1.it)("should prevent a TEACHER from deleting another teacher's lesson", async () => {
            mockCheckRole.mockResolvedValue({
                success: true,
                member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
            });
            await (0, globals_1.expect)(lesson_mutation_resolver_1.lessonMutationResolver.Mutation.deleteLesson({}, { id: mockLessonId }, mockContext)).rejects.toThrow("Vous n'êtes pas autorisé à supprimer cette leçon");
            (0, globals_1.expect)(mockPrisma.lesson.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=lesson-mutation.test.js.map
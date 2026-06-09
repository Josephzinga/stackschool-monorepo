import { lessonMutationResolver } from '../lesson-mutation.resolver';
import { prisma } from '@stackschool/db';
import { checkRole } from '../../../../lib/verify-role';
import { LessonStatusEnum, REFERENCE_DATE } from '@stackschool/shared';
import { parse } from 'date-fns';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

/**
 * On mock Prisma **/
jest.mock('@stackschool/db', () => ({
  prisma: {
    classSubjects: {
      findFirst: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock de checkRole
jest.mock('../../../../lib/verify-role', () => ({
  checkRole: jest.fn(),
  isAdmin: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCheckRole = checkRole as jest.MockedFunction<typeof checkRole>;

describe('Lesson Mutations', () => {
  const mockUserId = 'clp0abc1234537090abcdefgh';
  const mockSchoolId = 'clp0abc1234567890abcdefgh'; // Format CUID
  const mockTeacherId = 'clp0teacher1234567890abc';
  const mockClassId = 'clp0abc1234567890abcdtfgl';
  const mockSubjectId = 'clp0abc3234567890abcdtfgl';
  const mockClassSubjectId = 'clp0abc1234567890arcdtfgl';

  // mock du contexte de l'app
  const mockContext = {
    user: { id: mockUserId, email: 'admin@example.com' },
    schoolId: mockSchoolId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for checkRole (admin)
    mockCheckRole.mockResolvedValue({
      success: true,
      member: { role: 'ADMIN', teacher: { id: mockTeacherId } },
    });
  });

  describe('createLesson', () => {
    it('should create a lesson successfully as ADMIN', async () => {
      mockPrisma.classSubjects.findFirst.mockResolvedValue({
        id: mockClassSubjectId,
        subjectId: mockClassSubjectId,
        teacherId: mockTeacherId,
        groupId: mockClassId,
        weeklyHours: null,
        coefficient: 0,
      });

      mockPrisma.lesson.findMany.mockResolvedValue([]); // No existing lessons
      mockPrisma.lesson.create.mockResolvedValue({
        id: 'lesson-001',
        title: 'Maths Lesson',
        startTime: parse('MONDAY 08:00', 'EEEE HH:mm', REFERENCE_DATE),
        endTime: parse('MONDAY 09:00', 'EEEE HH:mm', REFERENCE_DATE),
        day: 'MONDAY',
        schoolId: mockSchoolId,
        classSubject: { teacherId: mockTeacherId },
        status: LessonStatusEnum.PLANNED,
        subtitle: null,
        roomId: null,
        createdAt: parse('MONDAY 08:00', 'EEEE HH:mm', REFERENCE_DATE),
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

      const result = await lessonMutationResolver.Mutation.createLesson(
        {},
        { input },
        mockContext,
      );

      expect(result).toHaveProperty('id', 'lesson-001');
      expect(mockPrisma.lesson.create).toHaveBeenCalledTimes(1);
      expect(mockCheckRole).toHaveBeenCalledWith({
        context: { userId: mockUserId, schoolId: mockSchoolId },
        roles: ['TEACHER', 'ADMIN'],
      });
    });

    it('should prevent a TEACHER from creating a lesson for another teacher', async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } }, // Different teacher
      });

      const input = {
        title: 'Maths Lesson',
        startTime: '08:00',
        endTime: '09:00',
        day: 'MONDAY',
        subjectId: mockSubjectId,
        teacherId: mockTeacherId, // This is the teacher we are trying to create for
        groupId: mockClassId,
        mode: 'CLASS',
      };

      await expect(
        lessonMutationResolver.Mutation.createLesson(
          {},
          { input },
          mockContext,
        ),
      ).rejects.toThrow(
        'Vous ne pouvez pas créer une leçon pour un autre professeur',
      );
      expect(mockPrisma.lesson.create).not.toHaveBeenCalled();
    });

    it('should throw an error if there is a time conflict', async () => {
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
          startTime: parse('MONDAY 08:30', 'EEEE HH:mm', REFERENCE_DATE),
          endTime: parse('MONDAY 09:30', 'EEEE HH:mm', REFERENCE_DATE),
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
      ]); // Conflict

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

      await expect(
        lessonMutationResolver.Mutation.createLesson(
          {},
          { input },
          mockContext,
        ),
      ).rejects.toThrow(/Conflit d'horaire/);
      expect(mockPrisma.lesson.create).not.toHaveBeenCalled();
    });

    it('should throw an error if assignation is not found', async () => {
      mockPrisma.classSubjects.findFirst.mockResolvedValue(null); // No assignation

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

      await expect(
        lessonMutationResolver.Mutation.createLesson(
          {},
          { input },
          mockContext,
        ),
      ).rejects.toThrow('Assignation (matière/classe/prof) introuvable');
      expect(mockPrisma.lesson.create).not.toHaveBeenCalled();
    });
  });

  // Add tests for updateLessonStatus, updateLesson, deleteLesson following similar patterns
  describe('updateLessonStatus', () => {
    const mockLessonId = 'lesson-001';
    const mockClassSubjectTeacherId = 'teacher-456';

    beforeEach(() => {
      mockPrisma.lesson.findUnique.mockResolvedValue({
        id: mockLessonId,
        status: LessonStatusEnum.PLANNED,
        classSubject: { teacherId: mockTeacherId },
        title: null,
        subtitle: null,
        startTime: parse('MONDAY 08:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        endTime: parse('MONDAY 10:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        schoolId: mockSchoolId,
        roomId: '',
        createdAt: parse('MONDAY 08:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        updatedAt: undefined,
      });
      mockPrisma.lesson.update.mockResolvedValue({
        id: mockLessonId,
        status: LessonStatusEnum.PLANNED,
        title: null,
        subtitle: null,
        startTime: parse('MONDAY 08:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        endTime: parse('MONDAY 10:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        schoolId: mockSchoolId,
        roomId: '',
        classSubject: { teacherId: mockTeacherId },
        createdAt: parse('MONDAY 08:00 ', 'EEEE HH:mm', REFERENCE_DATE),
        updatedAt: undefined,
      });
    });

    it('should update lesson status successfully as ADMIN', async () => {
      const result = lessonMutationResolver.Mutation.updateLessonStatus(
        {},
        { id: mockLessonId, status: 'ONGOING' },
        mockContext,
      );
      expect(result).toHaveProperty('status', 'ONGOING');
      expect(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
    });

    it('should update lesson status successfully as TEACHER for their own lesson', async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
      });

      const result = await lessonMutationResolver.Mutation.updateLessonStatus(
        {},
        { id: mockLessonId, status: 'ONGOING' },
        mockContext,
      );
      expect(result).toHaveProperty('status', 'ONGOING');
      expect(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
    });

    it("should prevent a TEACHER from updating status of another teacher's lesson", async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
      });

      await expect(
        lessonMutationResolver.Mutation.updateLessonStatus(
          {},
          { id: mockLessonId, status: 'ONGOING' },
          mockContext,
        ),
      ).rejects.toThrow(
        "Vous n'êtes pas autorisé à modifier le statut de cette leçon",
      );
      expect(mockPrisma.lesson.update).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid status transition', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue({
        id: mockLessonId,
        status: 'COMPLETED', // Cannot transition from COMPLETED to ONGOING
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

      await expect(
        lessonMutationResolver.Mutation.updateLessonStatus(
          {},
          { id: mockLessonId, status: 'ONGOING' },
          mockContext,
        ),
      ).rejects.toThrow(/Transition de statut impossible/);
      expect(mockPrisma.lesson.update).not.toHaveBeenCalled();
    });
  });

  describe('updateLesson', () => {
    const mockLessonId = 'lesson-001';
    const mockClassSubjectTeacherId = 'teacher-456';
    const mockClassSubjectGroupId = 'group-123';

    beforeEach(() => {
      mockPrisma.lesson.findUnique.mockResolvedValue({
        id: mockLessonId,
        title: 'Old Title',
        startTime: parse('MONDAY 08:00', 'EEEE HH:mm', REFERENCE_DATE),
        endTime: parse('MONDAY 09:00', 'EEEE HH:mm', REFERENCE_DATE),
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
      mockPrisma.lesson.findFirst.mockResolvedValue(null); // No conflict by default
    });

    it('should update lesson successfully as ADMIN', async () => {
      const input = {
        id: mockLessonId,
        title: 'New Title',
        startTime: '08:30',
        endTime: '09:30',
        day: 'MONDAY',
      };
      const result = await lessonMutationResolver.Mutation.updateLesson(
        {},
        { input },
        mockContext,
      );
      expect(result).toHaveProperty('title', 'New Title');
      expect(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
    });

    it('should update lesson successfully as TEACHER for their own lesson', async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
      });
      const input = {
        id: mockLessonId,
        title: 'New Title',
      };
      const result = await lessonMutationResolver.Mutation.updateLesson(
        {},
        { input },
        mockContext,
      );
      expect(result).toHaveProperty('title', 'New Title');
      expect(mockPrisma.lesson.update).toHaveBeenCalledTimes(1);
    });

    it("should prevent a TEACHER from updating another teacher's lesson", async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
      });
      const input = {
        id: mockLessonId,
        title: 'New Title',
      };
      await expect(
        lessonMutationResolver.Mutation.updateLesson(
          {},
          { input },
          mockContext,
        ),
      ).rejects.toThrow("Vous n'êtes pas autorisé à modifier cette leçon");
      expect(mockPrisma.lesson.update).not.toHaveBeenCalled();
    });

    it('should throw an error if there is a time conflict during update', async () => {
      mockPrisma.lesson.findFirst.mockResolvedValue({
        id: 'conflicting-lesson',
        startTime: parse('MONDAY 08:45', 'EEEE HH:mm', REFERENCE_DATE),
        endTime: parse('MONDAY 09:45', 'EEEE HH:mm', REFERENCE_DATE),
      }); // Conflict

      const input = {
        id: mockLessonId,
        startTime: '08:30',
        endTime: '09:30',
        day: 'MONDAY',
      };

      await expect(
        lessonMutationResolver.Mutation.updateLesson(
          {},
          { input },
          mockContext,
        ),
      ).rejects.toThrow(
        'Conflit détecté : la classe ou le professeur est déjà occupé sur ce créneau',
      );
      expect(mockPrisma.lesson.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteLesson', () => {
    const mockLessonId = 'lesson-001';
    const mockClassSubjectTeacherId = 'teacher-456';

    beforeEach(() => {
      mockPrisma.lesson.findUnique.mockResolvedValue({
        id: mockLessonId,
        schoolId: mockSchoolId,
        classSubject: { teacherId: mockClassSubjectTeacherId },
      });
      mockPrisma.lesson.delete.mockResolvedValue({ id: mockLessonId });
    });

    it('should delete lesson successfully as ADMIN', async () => {
      const result = await lessonMutationResolver.Mutation.deleteLesson(
        {},
        { id: mockLessonId },
        mockContext,
      );
      expect(result).toEqual({
        ok: true,
        message: 'Leçon supprimée avec succès.',
      });
      expect(mockPrisma.lesson.delete).toHaveBeenCalledTimes(1);
    });

    it('should delete lesson successfully as TEACHER for their own lesson', async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: mockClassSubjectTeacherId } },
      });

      const result = await lessonMutationResolver.Mutation.deleteLesson(
        {},
        { id: mockLessonId },
        mockContext,
      );
      expect(result).toEqual({
        ok: true,
        message: 'Leçon supprimée avec succès.',
      });
      expect(mockPrisma.lesson.delete).toHaveBeenCalledTimes(1);
    });

    it("should prevent a TEACHER from deleting another teacher's lesson", async () => {
      mockCheckRole.mockResolvedValue({
        success: true,
        member: { role: 'TEACHER', teacher: { id: 'another-teacher-id' } },
      });

      await expect(
        lessonMutationResolver.Mutation.deleteLesson(
          {},
          { id: mockLessonId },
          mockContext,
        ),
      ).rejects.toThrow("Vous n'êtes pas autorisé à supprimer cette leçon");
      expect(mockPrisma.lesson.delete).not.toHaveBeenCalled();
    });
  });
});

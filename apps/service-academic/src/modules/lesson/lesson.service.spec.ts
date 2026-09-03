import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AcademicRpcException,
  CORE_SERVICE,
  parseTimeString,
  SchoolRole,
} from '@stackschool/messaging';
import { Day, ResourceMode } from '../../graphql';
import { ClientProxy } from '@nestjs/microservices';

// ─────────────────────────────────────────────────────────────
// 1. LE MOCK DE PRISMA
// ─────────────────────────────────────────────────────────────
// On ne veut JAMAIS toucher une vraie base de données dans un test
// unitaire — ce serait un test d'INTÉGRATION, plus lent et plus fragile.
// À la place, on remplace chaque méthode Prisma qu'on utilise par une
// fonction factice (jest.fn()) dont ON contrôle la réponse.
//
// mockDeep aurait été une alternative (jest-mock-extended), mais pour
// un service avec peu de méthodes utilisées, un mock manuel explicite
// est plus lisible et plus facile à déboguer pour débuter.

const mockPrismaService = {
  classSubjects: {
    findUnique: jest.fn(),
  },
  teacherAssignment: {
    findUnique: jest.fn(),
  },
  lesson: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('LessonService', () => {
  let service: LessonService;

  // ───────────────────────────────────────────────────────────
  // 2. LE SETUP : reconstruit le module NestJS avant CHAQUE test
  // ───────────────────────────────────────────────────────────
  // beforeEach (pas beforeAll) garantit que chaque test démarre
  // avec des mocks "vierges" — un test ne doit JAMAIS dépendre
  // de l'état laissé par le test précédent.
  beforeEach(async () => {
    jest.clearAllMocks(); // réinitialise les apptels/retours simulés précédents

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CORE_SERVICE, useValue: ClientProxy },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
  });

  // ───────────────────────────────────────────────────────────
  // 3. DONNÉES DE TEST RÉUTILISABLES
  // ───────────────────────────────────────────────────────────
  // Centraliser les fixtures évite de répéter la même structure
  // dans chaque "it(...)" et rend les tests plus lisibles.
  const baseInput = {
    schoolId: 'school-1',
    groupId: 'group-1',
    subjectId: 'subject-1',
    teacherId: 'teacher-1',
    day: 'MONDAY' as Day,
    startTime: '08:00',
    endTime: '10:00',
    roomId: 'room-1',
    title: 'Mathématiques',
    mode: 'CLASS' as ResourceMode,
  };

  const mockSchoolUser = {
    id: 'school-user-1',
    isActive: true,
    isOwner: false,
    userId: 'user-1',
    schoolId: 'school-1',
    role: 'TEACHER' as SchoolRole,
    teacher: {
      id: 'teacher-1',
    },
  };
  const mockClassSubject = {
    id: 'cs-1',
    groupId: 'group-1',
    subject: { name: 'Mathématiques', id: 'subject-1' },
    group: { classes: [{ name: '6ème A' }] },
  };

  const mockAssignment = {
    id: 'assignment-1',
    schoolId: 'school-1',
    classSubjectId: 'cs-1',
    teacherId: 'teacher-1',
  };

  // ───────────────────────────────────────────────────────────
  // 4. CAS NOMINAL — tout se passe bien, la leçon est créée
  // ───────────────────────────────────────────────────────────
  it("crée la leçon quand il n'a aucun conflit", async () => {
    // ARRANGE : on programme chaque mock pour renvoyer ce qu'on attend
    // à cette étape précise du flow de create()
    mockPrismaService.classSubjects.findUnique.mockResolvedValue(
      mockClassSubject,
    );
    mockPrismaService.teacherAssignment.findUnique.mockResolvedValue(
      mockAssignment,
    );
    mockPrismaService.lesson.findMany.mockResolvedValue([]); // AUCUN conflit trouvé
    mockPrismaService.lesson.create.mockResolvedValue({
      id: 'lesson-1',
      ...baseInput,
      startTime: parseTimeString(baseInput.startTime),
      endTime: parseTimeString(baseInput.endTime),
    });

    // ACT : on appelle la vraie méthode qu'on teste
    const result = await service.create(
      baseInput,
      baseInput.schoolId,
      mockSchoolUser,
    );

    // ASSERT : on vérifie le résultat ET que Prisma a été appelé correctement
    expect(result).toHaveProperty('id', 'lesson-1');
    expect(mockPrismaService.lesson.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.lesson.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          schoolId: baseInput.schoolId,
          teacherAssignmentId: mockAssignment.id,
        }),
      }),
    );
  });

  // ───────────────────────────────────────────────────────────
  // 5. CAS D'ERREUR : la matière n'existe pas dans cette classe
  // ───────────────────────────────────────────────────────────
  it("lève FORBIDDEN si la matière n'est pas enseignée dans cette classe", async () => {
    mockPrismaService.classSubjects.findUnique.mockResolvedValue(null); // rien trouvé

    // On vérifie qu'une promesse rejetée lève bien la BONNE exception
    await expect(
      service.create(baseInput, baseInput.schoolId, mockSchoolUser),
    ).rejects.toThrow(AcademicRpcException);

    // Bonus : vérifie qu'on ne va JAMAIS jusqu'à la création
    // si l'étape de validation échoue plus tôt dans la méthode
    expect(mockPrismaService.lesson.create).not.toHaveBeenCalled();
  });

  // ───────────────────────────────────────────────────────────
  // 6. CAS D'ERREUR : le prof n'enseigne pas cette matière
  // ───────────────────────────────────────────────────────────
  it("lève FORBIDDEN si le professeur n'a pas cette assignation", async () => {
    mockPrismaService.classSubjects.findUnique.mockResolvedValue(
      mockClassSubject,
    );
    mockPrismaService.teacherAssignment.findUnique.mockResolvedValue(null);

    await expect(
      service.create(baseInput, baseInput.schoolId, mockSchoolUser),
    ).rejects.toThrow(AcademicRpcException);
    expect(mockPrismaService.lesson.create).not.toHaveBeenCalled();
  });

  // ───────────────────────────────────────────────────────────
  // 7. CAS LE PLUS IMPORTANT : conflit d'horaire détecté
  // ───────────────────────────────────────────────────────────
  it('lève CONFLICT si le professeur a déjà un cours à ce créneau', async () => {
    mockPrismaService.classSubjects.findUnique.mockResolvedValue(
      mockClassSubject,
    );
    mockPrismaService.teacherAssignment.findUnique.mockResolvedValue(
      mockAssignment,
    );

    // On simule un chevauchement : une leçon existante avec le MÊME teacherAssignmentId
    mockPrismaService.lesson.findMany.mockResolvedValue([
      {
        id: 'existing-lesson',
        teacherAssignmentId: mockAssignment.id,
        assignments: {
          classSubject: {
            subject: { name: 'Physique' },
            group: { classes: [{ name: '10ème' }] },
          },
        },
      },
    ]);

    await expect(
      service.create(baseInput, baseInput.schoolId, mockSchoolUser),
    ).rejects.toThrow(AcademicRpcException);

    // Vérifie le MESSAGE précis, pas juste le type d'exception —
    // ça garantit que c'est bien la bonne branche de ton if/else qui s'exécute
    await expect(
      service.create(baseInput, baseInput.schoolId, mockSchoolUser),
    ).rejects.toThrow(/déjà un cours/);

    expect(mockPrismaService.lesson.create).not.toHaveBeenCalled();
  });

  // ───────────────────────────────────────────────────────────
  // 8. CAS LIMITE : vérifie que findMany reçoit bien les BONS filtres
  // ───────────────────────────────────────────────────────────
  // Ce test ne vérifie pas le résultat final, mais la CONSTRUCTION
  // de la requête elle-même — utile pour un bug de filtrage subtil
  // (comme le mismatch de queue RabbitMQ vu plus tôt : un mauvais
  // paramètre passé silencieusement peut casser la logique sans
  // erreur explicite).
  it('interroge Prisma avec les bons critères de chevauchement horaire', async () => {
    mockPrismaService.classSubjects.findUnique.mockResolvedValue(
      mockClassSubject,
    );
    mockPrismaService.teacherAssignment.findUnique.mockResolvedValue(
      mockAssignment,
    );
    mockPrismaService.lesson.findMany.mockResolvedValue([]);
    mockPrismaService.lesson.create.mockResolvedValue({ id: 'lesson-1' });

    await service.create(baseInput, baseInput.schoolId, mockSchoolUser);

    expect(mockPrismaService.lesson.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          schoolId: baseInput.schoolId,
          day: baseInput.day,
        }),
      }),
    );
  });
});

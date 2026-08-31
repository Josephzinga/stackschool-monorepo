Oui, ça marche, et c'est même une meilleure architecture sur un point précis — mais il y a un compromis à bien comprendre : tu ne réduis pas le nombre d'appels RabbitMQ (toujours un call), tu **inverses le sens de l'orchestration** et tu gagnes en flexibilité côté client. Décortiquons.

## Ce que ce changement apporte réellement

**Le vrai gain : `teacher` devient une vraie entité Federation, pas une copie figée.** Avec `LessonTeacher` (type maison), tu dois manuellement choisir quels champs exposer (`firstName`, `lastName`, `weeklyHours`) et les embarquer dans chaque event. Avec `Teacher` en référence Federation, le client peut demander **n'importe quel champ de Teacher** (diploma, bio, department...) sans que tu aies besoin de toucher au resolver `getLessons` — le router va chercher ces champs à la demande auprès de `core`.

**Le vrai gain n°2 : mode CLASS n'a plus besoin d'appel RabbitMQ du tout pour les noms de profs.** C'est le point le plus intéressant de ta proposition — actuellement, en mode CLASS, `academic` doit faire un batch RabbitMQ vers `core` juste pour peupler les noms d'enseignants. Avec Federation par référence, le router s'en charge automatiquement.

## Schéma : `Lesson`/`LessonsEvents` migre dans `academic`, `Teacher` en stub

```graphql
# service-academic/src/graphql/schemas/lesson.graphql

type Teacher @key(fields: "id") {
  id: ID!
}

type LessonsEvents {
  id: ID!
  resourceId: ID
  title: String!
  startTime: String!
  endTime: String!
  day: Day!
  status: LessonStatus
  subject: Subject!
  group: Group
  teacher: Teacher # référence fédérée, plus de type maison LessonTeacher
  room: Room
}

type LessonResources {
  id: ID!
  title: String!
  weeklyHours: Int
}

type LessonsData {
  events: [LessonsEvents!]
  resources: [LessonResources!]
}

type LessonsList {
  data: LessonsData!
  meta: PaginationMeta
}

type Query {
  getLessons(input: GetLessonsInput!): LessonsList!
}
```

## Le resolver vit maintenant dans `academic`

```typescript
// apps/service-academic/src/lesson/lesson.resolver.ts
@Resolver()
export class LessonResolver {
  constructor(
    private prisma: PrismaService,
    private coreClient: CoreClientService,
  ) {}

  @Query(() => LessonsList)
  @UseGuards(GqlAuthGuard, SchoolAccessGuard) // dupliqué depuis core, cf. remarque plus bas
  async getLessons(
    @Args('input') input: GetLessonsInput,
    @Context() ctx,
  ): Promise<LessonsList> {
    const schoolId = ctx.schoolUser.schoolId;

    if (input.mode === 'TEACHER') {
      return this.getLessonsByTeacherResource(input, schoolId);
    }
    return this.getLessonsByClassResource(input, schoolId);
  }

  private async getLessonsByTeacherResource(
    input: GetLessonsInput,
    schoolId: string,
  ) {
    // UN SEUL appel RabbitMQ — vers core, pour obtenir les IDs paginés + les infos d'affichage
    const { teachers, totalCount } =
      await this.coreClient.findTeachersPaginated({
        schoolId,
        department: input.department,
        hasLessonOnly: input.hasLessonOnly,
        page: input.page,
        limit: input.limit,
      });

    if (teachers.length === 0) {
      return {
        data: { events: [], resources: [] },
        meta: { totalCount: 0, hasNextPage: false },
      };
    }

    const teacherIds = teachers.map((t) => t.id);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(input.status ? { status: input.status } : {}),
        assignments: { teacherId: { in: teacherIds } },
      },
      include: {
        assignments: {
          include: {
            classSubject: { include: { subject: true, group: true } },
          },
        },
        room: true,
      },
    });

    return {
      data: {
        resources: teachers.map((t) => ({
          id: t.id,
          title: t.fullName,
          weeklyHours: t.weeklyHours,
        })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.teacherId,
          title: l.title ?? l.assignments.classSubject.subject.name,
          startTime: formatTime(l.startTime),
          endTime: formatTime(l.endTime),
          day: l.day,
          status: l.status,
          subject: l.assignments.classSubject.subject,
          group: l.assignments.classSubject.group,
          room: l.room,
          teacher: { __typename: 'Teacher', id: l.assignments.teacherId }, // stub, résolu par Federation à la demande
        })),
      },
      meta: {
        totalCount,
        hasNextPage: (input.page + 1) * input.limit < totalCount,
      },
    };
  }

  private async getLessonsByClassResource(
    input: GetLessonsInput,
    schoolId: string,
  ) {
    // ENTIÈREMENT local — aucun appel RabbitMQ nécessaire, même pour les noms de profs
    const where = {
      schoolId,
      ...(input.hasLessonOnly ? { lessonsCount: { gt: 0 } } : {}),
    };

    const [groups, totalCount] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip: input.page * input.limit,
        take: input.limit,
      }),
      this.prisma.group.count({ where }),
    ]);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        deletedAt: null,
        assignments: {
          classSubject: { groupId: { in: groups.map((g) => g.id) } },
        },
      },
      include: { assignments: true, room: true },
    });

    return {
      data: {
        resources: groups.map((g) => ({
          id: g.id,
          title: g.name,
          weeklyHours: g.weeklyLessonsCount,
        })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.classSubject.groupId,
          teacher: { __typename: 'Teacher', id: l.assignments.teacherId }, // résolu par Federation, PAS d'appel manuel
          // ... reste des champs
        })),
      },
      meta: {
        totalCount,
        hasNextPage: (input.page + 1) * input.limit < totalCount,
      },
    };
  }
}
```

## `core` expose un `@ResolveReference` pour `Teacher` (déjà probablement en place) + un pattern RabbitMQ dédié

```typescript
// service-core : déjà nécessaire pour Federation
@Resolver('Teacher')
export class TeacherResolver {
  @ResolveReference()
  resolveReference(reference: { id: string }) {
    return this.teacherService.findById(reference.id);
  }
}
```

```typescript
// service-core : nouveau pattern pour la pagination demandée par academic
@MessagePattern(CORE_PATTERNS.FIND_TEACHERS_PAGINATED)
async findTeachersPaginated(@Payload() dto: FindTeachersPaginatedDto) {
  const where = {
    schoolId: dto.schoolId,
    ...(dto.department ? { department: dto.department } : {}),
    ...(dto.hasLessonOnly ? { classesCount: { gt: 0 } } : {}),
  };

  const [teachers, totalCount] = await Promise.all([
    this.prisma.teacher.findMany({
      where, include: { schoolProfile: true },
      skip: dto.page * dto.limit, take: dto.limit,
    }),
    this.prisma.teacher.count({ where }),
  ]);

  return {
    teachers: teachers.map((t) => ({
      id: t.id, fullName: `${t.schoolProfile.firstName} ${t.schoolProfile.lastName}`, weeklyHours: t.weeklyHours,
    })),
    totalCount,
  };
}
```

## Le compromis à bien peser : duplication du guard d'accès école

Puisque le resolver `getLessons` vit maintenant dans `academic`, `SchoolAccessGuard`/`GqlAuthGuard` (ou leur équivalent `TrustedSchoolContextGuard` vu plus tôt) doivent aussi tourner dans `academic`, pas seulement dans `core`. C'est cohérent avec le modèle qu'on a déjà mis en place (chaque subgraph doit se protéger lui-même, ne jamais faire une confiance aveugle même en interne) — donc pas un vrai coût nouveau, juste à ne pas oublier.

## Bilan du changement

|                                | Avant (query dans `core`)              | Après (query dans `academic`)                       |
| ------------------------------ | -------------------------------------- | --------------------------------------------------- |
| Appels RabbitMQ mode TEACHER   | 1 (`core → academic`)                  | 1 (`academic → core`), sens inversé                 |
| Appels RabbitMQ mode CLASS     | 1 (`academic → core`, pour noms profs) | **0** — Federation résout `teacher` à la demande    |
| Flexibilité du champ `teacher` | Figé aux champs de `LessonTeacher`     | N'importe quel champ `Teacher`, résolu à la demande |
| Guard d'autorisation           | Uniquement dans `core`                 | Dupliqué dans `academic` aussi                      |

Le vrai gain net est le mode CLASS (zéro appel réseau au lieu d'un), et la flexibilité du type `Teacher`. Ça vaut le coup. Tu veux qu'on écrive aussi `CoreClientService.findTeachersPaginated` côté academic, avec le `sendRmqRequest` habituel ?

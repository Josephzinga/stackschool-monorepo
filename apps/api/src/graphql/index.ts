import { createHandler } from 'graphql-http/lib/use/express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'node:path';
import * as fs from 'node:fs';
import { studentResolver as searchStudentResolver } from './resolvers/searchSchoolStudent.resolver';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';
import { getClassesSubjectsResolver } from './resolvers/getClassesSubjects.resolver';
import { confirmCompleteProfileResolver } from './resolvers/confirm-complete-profile.resolver';
import { meResolver } from './resolvers/me.resolver';
import { schoolResolver } from './resolvers/school.resolver';
import { teacherResolver } from './resolvers/teacher/teacher.resolver';
import { studentResolver } from './resolvers/student/student.resolver';
import { studentQueryResolver } from './resolvers/student/student-query.resolver';
import { classResolver } from './resolvers/class/class.resolver';
import { ServiceError } from '@stackschool/shared';
import { prisma, SchoolUser } from '@stackschool/db';
import { ZodError } from 'zod';
import { createLoaders } from './resolvers/data-loader';
import { lessonsResolver } from './resolvers/lesson/lessons.resolver';
import { subjectResolver } from './resolvers/subject.resolver';
import { createServiceError } from '../utils/api-errors';
import { classMutationResolver } from './resolvers/class/class-mutation.resolver';
import { RoomResolver } from './resolvers/room.resolver';
import { groupResolver } from './resolvers/groups.resolver';
import { classQueryResolver } from './resolvers/class/class-query.resolver';
import { lessonMutationResolver } from './resolvers/lesson/lesson-mutation.resolver';
import { lessonQueryResolver } from './resolvers/lesson/lesson-query.resolver';
import { teacherMutationResolver } from './resolvers/teacher/teacher-mutation.resolver';
import { parentQueryResolver } from './resolvers/parent/parent-query.resolver';
import { parentResolver } from './resolvers/parent/parent.resolver';
import { teacherQueryResolver } from './resolvers/teacher/teacher-query.resolver';

const dirPath = path.resolve(
  __dirname,
  '../../../../packages/shared/src/graphql',
);
const dirSchema = fs.readdirSync(dirPath, 'utf-8');
const files = dirSchema.filter((f) => f.includes('.graphql'));

let typeDefs = '';
for (const file of files) {
  typeDefs += fs.readFileSync(`${dirPath}/${file}`, 'utf-8') + '\n';
}

// Fusion des resolvers
const resolvers = merge(
  {},
  meResolver,
  schoolResolver,
  teacherResolver,
  teacherMutationResolver,
  teacherQueryResolver,
  studentQueryResolver,
  studentResolver,
  classQueryResolver,
  lessonMutationResolver,
  lessonQueryResolver,
  classResolver,
  classMutationResolver,
  searchStudentResolver,
  searchSchoolResolver,
  getClassesSubjectsResolver,
  confirmCompleteProfileResolver,
  lessonsResolver,
  subjectResolver,
  RoomResolver,
  groupResolver,
  parentQueryResolver,
  parentResolver,
);

// Création du schéma exécutable
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlMiddleware = createHandler({
  schema,
  context: async (req) => {
    const user = req.raw.user;
    const schoolId = req.raw.headers['x-school-id'] as string;
    let membership: SchoolUser | null | undefined;
    if (user && schoolId) {
      membership = await prisma.schoolUser.findFirst({
        where: {
          userId: user.id,
          schoolId: schoolId,
        },
      });
      if (!membership) {
        throw createServiceError('Accès refusé à cette école', 403);
      }
    }

    return {
      user,
      schoolId,
      loaders: createLoaders(prisma),
      membership,
    };
  },
  formatError: (err) => {
    console.error(
      "Message d'erreur graphql \n",
      err.message,
      'Details \n',
      err?.code,
      err?.status,
      err?.statusCode,
    );
    if (err instanceof ZodError) {
      return {
        message: 'Erreur de validation',
        code: 400,
        name: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (err instanceof ServiceError) {
      return {
        message: err.message,
        code: err.statusCode || 500,
        name: 'SERVICE_ERROR',
      };
    }

    return {
      message: err.message || 'Une erreur interne est survenue',
      code: 500,
      name: 'INTERNAL_SERVER_ERROR',
    };
  },
});
export default graphqlMiddleware;

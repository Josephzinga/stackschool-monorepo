import type { Request } from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'node:path';
import * as fs from 'node:fs';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';
import { confirmCompleteProfileResolver } from './resolvers/confirm-complete-profile.resolver';
import { meResolver } from './resolvers/me.resolver';
import { schoolResolver } from './resolvers/school.resolver';
import { hasPermission, ServiceError } from '@stackschool/shared';
import { prisma, SchoolUser } from '@stackschool/db';
import { ZodError } from 'zod';
import { createLoaders } from './resolvers/data-loader';
import { subjectResolver } from './resolvers/subject.resolver';
import { createServiceError } from '../utils/api-errors';
import { RoomResolver } from './resolvers/room.resolver';
import { groupResolver } from './resolvers/groups.resolver';
import { parentQueryResolver } from './resolvers/parent/parent-query.resolver';
import { parentResolver } from './resolvers/parent/parent.resolver';
import { parentMutationResolver } from './resolvers/parent/parent-mutation.resolver';
import { lessonResolvers } from './resolvers/lesson';
import { classSubjectResolvers } from './resolvers/classSubject';
import { classResolvers } from './resolvers/class';
import { teacherResolvers } from './resolvers/teacher';
import { studentResolvers } from './resolvers/student';
import { attendanceResolver } from './resolvers/attendance/query/attendance.resolver';
import { attendanceResolvers } from './resolvers/attendance';
import { checkRole } from '../lib/verify-role';

const dirPath = path.resolve(
  __dirname,
  '../../../../packages/shared/src/graphql',
);
const dirSchema = fs.readdirSync(dirPath, 'utf-8');
const files = dirSchema.filter(
  (f) => f.includes('.graphql') || f.includes('.gql'),
);

let typeDefs = '';
for (const file of files) {
  typeDefs += fs.readFileSync(`${dirPath}/${file}`, 'utf-8') + '\n';
}

const resolvers = merge(
  {},
  meResolver,
  schoolResolver,
  teacherResolvers,
  studentResolvers,
  classResolvers,
  lessonResolvers,
  searchSchoolResolver,
  confirmCompleteProfileResolver,
  classSubjectResolvers,
  subjectResolver,
  RoomResolver,
  groupResolver,
  parentQueryResolver,
  parentResolver,
  parentMutationResolver,
  attendanceResolvers,
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlMiddleware = createHandler({
  schema,

  context: async (req) => {
    const { user, schoolId, membership } = await getSchoolMember(req);
    return {
      user,
      schoolId,
      membership,
      req: req.raw as Request,
      loaders: createLoaders(prisma),
      prisma,
      hasPermission,
      checkRole,
    };
  },
  formatError: (err) => {
    console.error("Message d'erreur graphql \n", err.message);
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

const getSchoolMember = async (req: any) => {
  const user = req.raw.user;
  const schoolId = req.raw.headers['x-lists-id'] as string;
  let membership: SchoolUser | null = null;
  if (user && schoolId) {
    membership = await prisma.schoolUser.findUnique({
      where: {
        schoolId_userId: {
          userId: user.id,
          schoolId: schoolId,
        },
      },
    });
    if (!membership) {
      throw createServiceError('Accès refusé à cette école', 403);
    }
  }

  return {
    user,
    schoolId,
    membership,
  };
};

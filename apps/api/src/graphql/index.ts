import { createHandler } from 'graphql-http/lib/use/express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'node:path';
import * as fs from 'node:fs';
import { studentResolver } from './resolvers/searchSchoolStudent.resolver';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';
import { getClassesSubjectsResolver } from './resolvers/getClassesSubjects.resolver';
import { confirmCompleteProfileResolver } from './resolvers/confirm-complete-profile.resolver';
import { meResolver } from './resolvers/me.resolver';
import { schoolResolver } from './resolvers/school.resolver';
import { listResolver } from './resolvers/list.resolver';
import { ServiceError } from '@stackschool/shared';
import { createTeacherResolver } from './resolvers/teacher/create-list-teacher.resolver';
import { ZodError } from 'zod';
import { teacherResolver } from './resolvers/teacher/teacher.resolver';
import { teacherListResolver } from './resolvers/teacher/list.resolver';

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
  listResolver, // Ajout du nouveau resolver
  studentResolver,
  searchSchoolResolver,
  getClassesSubjectsResolver,
  confirmCompleteProfileResolver,
  createTeacherResolver,
  teacherResolver,
  teacherListResolver,
);

// Création du schéma exécutable
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlMiddleware = createHandler({
  schema,
  context: (req) => ({
    user: req.raw.user,
  }),
  formatError: (err) => {
    if (err instanceof ZodError) {
      return {
        message: 'Erreur de validation',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (err instanceof ServiceError) {
      return {
        message: err.message,
        code: err.statusCode || 'SERVICE_ERROR',
        name: 'SERVICE_ERROR',
      };
    }

    return {
      message: err.message || 'Une erreur interne est survenue',
      code: 'INTERNAL_SERVER_ERROR',
    };
  },
});
export default graphqlMiddleware;

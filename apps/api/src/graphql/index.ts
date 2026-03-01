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
import { createTeacherResolver } from './resolvers/teacher/create-list-teacher.resolver';
import { listResolver } from './resolvers/list.resolver';
import { studentResolver } from './resolvers/student/student.resolver';
import { createStudentResolver } from './resolvers/student/create-student.resolver';
import { ServiceError } from '@stackschool/shared';
import { ZodError } from 'zod';

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
  createTeacherResolver,
  createStudentResolver,
  listResolver,
  studentResolver,
  searchStudentResolver,
  searchSchoolResolver,
  getClassesSubjectsResolver,
  confirmCompleteProfileResolver,
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
    console.error(
      "Message d'erreur graphql \n",
      err.message,
      'Details \n',
      err,
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

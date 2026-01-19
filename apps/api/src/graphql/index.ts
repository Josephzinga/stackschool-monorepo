import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import path from 'node:path';
import * as fs from 'node:fs';
import { studentResolver } from './resolvers/searchSchoolStudent.resolver';
import { parentResolver } from './resolvers/createParentStudent.resolver';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';
import { getClassesSubjectsResolver } from './resolvers/getClassesSubjects.resolver';
import { confirmCompleteProfileResolver } from './resolvers/confirm-complete-profile.resolver';
import { meResolver } from './resolvers/me.resolver';
import { ServiceError } from '@stackschool/shared';
import { ZodError } from 'zod';

const dirPath = path.resolve(
  __dirname,
  '../../../../packages/shared/src/graphql',
);
const dirSchema = fs.readdirSync(dirPath, 'utf-8');
const files = dirSchema.filter((f) => f.includes('.graphql'));

let typeDefsSchema = '';
for (const file of files) {
  typeDefsSchema += fs.readFileSync(`${dirPath}/${file}`, 'utf-8') + '\n';
}

const schema = buildSchema(typeDefsSchema);

const rootResolvers = merge(
  {},
  meResolver,
  studentResolver,
  parentResolver,
  searchSchoolResolver,
  getClassesSubjectsResolver,
  confirmCompleteProfileResolver,
);

const graphqlMiddleware = createHandler({
  rootValue: rootResolvers,
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
      };
    }

    return {
      message: err.message || 'Une erreur interne est survenue',
      code: 'INTERNAL_SERVER_ERROR',
    };
  },
});
export default graphqlMiddleware;

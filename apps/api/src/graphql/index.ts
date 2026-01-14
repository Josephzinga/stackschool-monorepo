import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import path from 'node:path';
import * as fs from 'node:fs';
import { studentResolver } from './resolvers/searchSchoolStudent.resolver';
import { parentResolver } from './resolvers/createParentStudent.resolver';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';
import { getClassesSubjectsResolver } from './resolvers/getClassesSubjects.resolver';

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
  studentResolver,
  parentResolver,
  searchSchoolResolver,
  getClassesSubjectsResolver,
);

const graphqlMiddleware = createHandler({
  rootValue: rootResolvers,
  schema,
  context: (req) => ({
    user: req.raw.user,
  }),
});
export default graphqlMiddleware;

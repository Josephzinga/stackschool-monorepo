import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import path from 'node:path';
import * as fs from 'node:fs';
import { studentResolver } from './resolvers/searchSchoolStudent.resolver';
import { parentResolver } from './resolvers/createParentStudent.resolver';
import { searchSchoolResolver } from './resolvers/searchSchool.resolver';
import merge from 'lodash.merge';

const schemaPath = path.resolve(
  __dirname,
  '../../../../packages/shared/src/graphql/schema.graphql',
);

const typeDefs = fs.readFileSync(schemaPath, 'utf-8');
const schema = buildSchema(typeDefs);

const rootResolvers = merge(
  {},
  studentResolver,
  parentResolver,
  searchSchoolResolver,
);

const graphqlMiddleware = createHandler({
  rootValue: rootResolvers,
  schema,
  context: (req) => ({
    user: req.raw.user,
  }),
});
export default graphqlMiddleware;

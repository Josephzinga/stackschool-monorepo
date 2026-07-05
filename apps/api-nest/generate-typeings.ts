import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'node:path';

const definitionsFactory = new GraphQLDefinitionsFactory();
async function main() {
  await definitionsFactory.generate({
    typePaths: ['../../packages/shared/src/graphql/**/*.graphql'],
    path: join(process.cwd(), 'src/graphql/graphql.ts'),
    outputAs: 'class',
    emitTypenameField: true,
    enumsAsTypes: true,
  });
}

main()
  .then(() => console.log('Générer'))
  .catch((e) => console.error('Error', e));

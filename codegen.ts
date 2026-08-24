import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'apps/service-auth/src/graphql/**/*.graphql',
    'apps/service-core/src/graphql/schemas/**/*.graphql',
    'apps/service-academic/src/graphql/**/*.graphql',
    'packages/contracts/src/graphql/common/**/*.graphql',
    // 'apps/service-operations/src/graphql/**/*.graphql',
  ],

  documents: ['packages/contracts/src/graphql/operations/**/*.graphql'],

  generates: {
    'packages/ui/src/generated/v2/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        // AJOUTS ICI POUR CORRIGER LE CRASH MOBILE :
        enumsAsTypes: true,
        scalars: {
          SchoolId: 'string',
          DateTime: 'Date',
          Date: 'Date',
        },
        skipTypename: false,
        reactQueryVersion: 5,
        addInfiniteQuery: true,

        fetcher: {
          func: '@stackschool/contracts#fetcher',
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
      },
    },
  },
};

export default config;

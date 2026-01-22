import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/shared/src/graphql/**/*.graphql',

  documents: ['packages/shared/src/graphql/operations/**/*.graphql'],

  generates: {
    // 1. Types pour le Backend (Resolvers)
    'apps/api/src/graphql/types.generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@stackschool/shared#Context',
        useIndexSignature: true,
      },
    },

    // 2. SDK Client (Types + Hooks React Query)
    'packages/ui/src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query', // Génère les hooks useQuery
      ],
      config: {
        scalar: {
          SchoolId: 'string',
        },
        skipTypename: false,
        // Configuration spécifique React Query v5
        reactQueryVersion: 5,
        addInfiniteQuery: true,

        fetcher: {
          func: '../lib/graphql-fetcher#fetcher',
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
      },
    },
  },
};

export default config;

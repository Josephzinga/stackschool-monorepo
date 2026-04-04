import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/shared/src/graphql/**/*.graphql',

  documents: ['packages/shared/src/graphql/operations/**/*.graphql'],

  generates: {
    'apps/api/src/graphql/types.generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@stackschool/api/src/types/graphql.type#Context',
        useIndexSignature: true,
        enumValues: {
          StudentStatus:
            '@stackschool/db/src/prisma/client/generated#StudentStatus',
          Gender: '@stackschool/db/src/prisma/client/generated#Gender',
          Day: '@stackschool/db/src/prisma/client/generated#Day',
          LessonStatus:
            '@stackschool/db/src/prisma/client/generated#LessonStatus',
        },
      },
    },

    'packages/ui/src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        scalar: {
          SchoolId: 'string',
          DateTime: 'Date',
        },
        skipTypename: false,
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
/*   mappers: {
          Classe: '@stackschool/db/src/prisma/client/generated#Class',
          Teacher: '@stackschool/db/src/prisma/client/generated#Teacher',
          Lesson: '@stackschool/db/src/prisma/client/generated#Lesson',
          Subject: '@stackschool/db/src/prisma/client/generated#Subject',
          Profile: '@stackschool/db/src/prisma/client/generated#Profile',
          Student: '@stackschool/db/src/prisma/client/generated#Student',
        }, */

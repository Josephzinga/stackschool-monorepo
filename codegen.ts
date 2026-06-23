import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/shared/src/graphql/**/*.graphql',

  documents: ['packages/shared/src/graphql/operations/**/*.graphql'],

  generates: {
    'apps/api/src/graphql/types.generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../types/context#Context',
        useIndexSignature: true,
        useTypeImports: true,
        mappers: {
          AttendanceStatus:
            '@stackschool/shared/src/validation/attendance.schema#AttendanceStatusEnum',
          SchoolRole: '@stackschool/db/src/prisma/client/generated#SchoolRole',
        },
        enumValues: {
          StudentStatus:
            '@stackschool/db/src/prisma/client/generated#StudentStatus',
          Gender: '@stackschool/db/src/prisma/client/generated#Gender',
          Day: '@stackschool/db/src/prisma/client/generated#Day',
          LessonStatus:
            '@stackschool/db/src/prisma/client/generated#LessonStatus',
          TransportMode:
            '@stackschool/db/src/prisma/client/generated#TransportMode',
          SubjectCategory:
            '@stackschool/db/src/prisma/client/generated#SubjectCategory',
          RelationType:
            '@stackschool/db/src/prisma/client/generated#RelationType',
          GroupType: '@stackschool/db/src/prisma/client/generated#GroupType',
          AttendanceStatus:
            '@stackschool/shared/src/validation/attendance.schema#AttendanceStatusEnum',
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
        // AJOUTS ICI POUR CORRIGER LE CRASH MOBILE :
        //   enumsAsTypes: true,  Transforme les enums GraphQL en types (ex: 'PRESENT' | 'ABSENT')
        // useTypeImports: true,  Force l'utilisation de "import type" côté client
        mappers: {
          AttendanceStatus:
            '@stackschool/shared/src/validation/attendance.schema#AttendanceStatusEnum',
        },
        enumValues: {
          AttendanceStatus:
            '@stackschool/shared/src/validation/attendance.schema#AttendanceStatusEnum',
        },
        scalars: {
          SchoolId: 'string',
          DateTime: 'Date',
          Date: 'Date',
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

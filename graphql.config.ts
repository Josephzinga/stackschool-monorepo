const config = {
  projects: {
    client: {
      schema: [
        'apps/service-auth/src/graphql/**/*.graphql',
        'apps/service-core/src/graphql/schemas/**/*.graphql',
        'apps/service-academic/src/graphql/**/*.graphql',
        'packages/contracts/src/graphql/common/**/*.graphql',
      ],
      documents: 'packages/ui/src/graphql/operations/**/*.graphql',
    },
  },
};

export default config;

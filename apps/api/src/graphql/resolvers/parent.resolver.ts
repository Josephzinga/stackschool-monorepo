import { Resolvers } from '../types.generated';

export const parentResolver: Resolvers = {
  Query: {
    getSchoolParents: async (_, { filter }, { schoolId, user }) => {},
  },
};

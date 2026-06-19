import { Resolvers } from '../../types.generated';

export const attendanceResolver: Resolvers = {
  AttendanceRecord: {
    recordedBy: async (parent, _args, { loaders }) => {
      if (!parent.recordedBy) return null;
      return await loaders.userLoader.load(parent.recordedBy);
    },
  },
};

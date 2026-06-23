import { Resolvers } from '../../../types.generated';

export const attendanceResolver: Resolvers = {
  AttendanceRecord: {
    recordedBy: async (parent, _args, { loaders, prisma }) => {
      if (!parent?.recordedBy && typeof parent.recordedBy !== 'string')
        return null;
      const user = await loaders.userLoader.load(
        parent.recordedBy as unknown as string,
      );
      return user || null;
    },
  },
};

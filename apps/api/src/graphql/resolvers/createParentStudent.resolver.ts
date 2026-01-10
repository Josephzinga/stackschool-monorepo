import { Context, ParentFormData } from '@stackschool/shared';
import { redisClient } from '../../lib/redis';

export const parentResolver = {
  completeParentProfile: async (
    { input }: { input: ParentFormData },
    context: Context,
  ) => {
    const { children, contactPreference, profession } = input;

    const userId = context.user.id;
    const redisKey = `complete_profile:${userId}`;
    const data = await redisClient.get(redisKey);
    console.log('data from redis', data);
  },
};

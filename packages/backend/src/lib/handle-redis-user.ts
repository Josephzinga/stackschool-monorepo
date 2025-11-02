import { Account, Profile, User } from "@stackschool/shared";
import { redisClient } from "./redis";
import { prisma } from "./prisma";

export const getUserFromRedis = async (userId: string) => {
  const redisKey = `user_profile:${userId}`;

  const redisUser = await redisClient.get(redisKey);

  if (redisUser) {
    return JSON.parse(redisUser);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, Account: true },
  });

  await redisClient.setEx(redisKey, 12 * 60 * 60, JSON.stringify(user));
  return user;
};

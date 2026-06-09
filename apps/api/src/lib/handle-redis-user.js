"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearUserFromRedis = exports.getUserFromRedis = void 0;
const redis_1 = require("./redis");
const prisma_1 = require("./prisma");
const getUserFromRedis = async (userId) => {
    const redisKey = `user_profile:${userId}`;
    const redisUser = await redis_1.redisClient.get(redisKey);
    if (redisUser) {
        return JSON.parse(redisUser);
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: {
                select: {
                    id: true,
                    photo: true,
                    lastname: true,
                    firstname: true,
                },
            },
            Account: true,
        },
    });
    await redis_1.redisClient.setEx(redisKey, 12 * 60 * 60, JSON.stringify(user));
    return user;
};
exports.getUserFromRedis = getUserFromRedis;
const clearUserFromRedis = (userId) => {
    const redisKey = `user_profile:${userId}`;
    redis_1.redisClient.del(redisKey);
};
exports.clearUserFromRedis = clearUserFromRedis;
//# sourceMappingURL=handle-redis-user.js.map
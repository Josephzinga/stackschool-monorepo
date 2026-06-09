"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertOauthUser = upsertOauthUser;
const db_1 = require("@stackschool/db");
const api_errors_1 = require("../utils/api-errors");
const handle_redis_user_1 = require("../lib/handle-redis-user");
async function upsertOauthUser({ provider, providerAccountId, email, emailVerified, displayName, firstname, lastname, avatar, accessToken, refreshToken, }) {
    try {
        const existingAccount = await db_1.prisma.account.findUnique({
            where: { provider_providerAccountId: { provider, providerAccountId } },
            include: { user: { include: { profile: true } } },
        });
        if (existingAccount) {
            await db_1.prisma.account.update({
                where: { id: existingAccount.id },
                data: {
                    access_token: accessToken ?? existingAccount.access_token,
                    refresh_token: refreshToken ?? existingAccount.refresh_token,
                },
            });
            return excludeField(existingAccount.user);
        }
        if (email) {
            const user = await db_1.prisma.user.findUnique({
                where: { email, isActive: true },
                include: { profile: true, Account: true },
            });
            if (user) {
                (0, handle_redis_user_1.clearUserFromRedis)(user.id);
                await db_1.prisma.account.create({
                    data: {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        provider,
                        providerAccountId,
                        user: { connect: { id: user.id } },
                    },
                });
                if (!user?.profile) {
                    await db_1.prisma.profile.create({
                        data: {
                            photo: avatar,
                            firstname,
                            lastname,
                            user: { connect: { id: user.id } },
                        },
                    });
                }
                else if (!user?.profile.photo && avatar) {
                    await db_1.prisma.profile.update({
                        where: { id: user.profile.id },
                        data: {
                            photo: avatar,
                        },
                    });
                }
                const fresh = await db_1.prisma.user.findUnique({
                    where: { id: user.id },
                    include: { profile: true },
                });
                return excludeField(fresh ?? user);
            }
        }
        const safeEmail = email || `${provider}:${providerAccountId}@local.invalid`;
        const newUser = await db_1.prisma.user.create({
            data: {
                email: safeEmail,
                emailVerified,
                username: displayName,
                profile: {
                    create: {
                        firstname,
                        lastname,
                        photo: avatar,
                    },
                },
                Account: {
                    create: {
                        provider,
                        providerAccountId,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    },
                },
            },
            include: { profile: true, Account: true },
        });
        return excludeField(newUser);
    }
    catch (err) {
        if (err?.code === 'P2002') {
            try {
                const providerId = providerAccountId ?? null;
                const found = await db_1.prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider,
                            providerAccountId: providerId,
                        },
                    },
                    include: { user: { include: { profile: true } } },
                });
                if (found)
                    return excludeField(found.user);
            }
            catch (e) {
                (0, api_errors_1.createServiceError)("Echec de la récupération de l'utilisateur dans le P2002");
            }
        }
        return null;
    }
}
function excludeField(user) {
    if (!user)
        return user;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
//# sourceMappingURL=auth-user.service.js.map
import { prisma } from '@stackschool/db';
import { createServiceError } from '../utils/api-errors';
import { clearUserFromRedis } from '../lib/handle-redis-user';

export interface UpsertOauthUserParams {
  provider: 'google' | 'facebook';
  providerAccountId: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string;
  firstname?: string;
  lastname?: string;
  avatar: string | null;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Crée ou met à jour un utilisateur à partir des données d'un fournisseur OAuth.
 *
 * @param {UpsertOauthUserParams} params - Les données de l'utilisateur OAuth.
 * @returns {Promise<any>} L'utilisateur mis à jour ou créé (sans le mot de passe).
 */
export async function upsertOauthUser({
  provider,
  providerAccountId,
  email,
  emailVerified,
  displayName,
  firstname,
  lastname,
  avatar,
  accessToken,
  refreshToken,
}: UpsertOauthUserParams): Promise<any> {
  try {
    const existingAccount = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: { include: { profile: true } } },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          access_token: accessToken ?? existingAccount.access_token,
          refresh_token: refreshToken ?? existingAccount.refresh_token,
        },
      });

      return excludeField(existingAccount.user);
    }

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true, Account: true },
      });
      // si le user avec l'email trouvé on crée un compte
      if (user) {
        // supprimer le user dans redis
        clearUserFromRedis(user.id);
        // créer l'Account lié à ce user (si déjà lié, on ignore)

      
        await prisma.account.create({
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            provider,
            providerAccountId,
            user: { connect: { id: user.id } },
          },
        });
        // si il y n'a pas de profile
        if (!user?.profile) {
          // on crée un profile pour l'utilisateur

          await prisma.profile.create({
            data: {
              photo: avatar,
              firstname,
              lastname,
              user: { connect: { id: user.id } },
            },
          });
          // si il y a un profile est que cet profile a une photo, en même temps que l'avatar du provider n'est pas null
        } else if (!user?.profile.photo && avatar) {
          // on met à jour le profile de l'utilisateur
          await prisma.profile.update({
            where: { id: user.profile.id },
            data: {
              photo: avatar,
            },
          });
        }
        // recherche un user avec se donnée à jour
        const fresh = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true },
        });
        return excludeField(fresh ?? user);
      }
    }

    const safeEmail = email || `${provider}:${providerAccountId}@local.invalid`;

    const newUser = await prisma.user.create({
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
  } catch (err: any) {
    if (err?.code === 'P2002') {
      // tenter de récupérer l'utilisateur par providerAccountId ou email
      try {
        const providerId = providerAccountId ?? null;
        const found = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId: providerId,
            },
          },
          include: { user: { include: { profile: true } } },
        });

        if (found) return excludeField(found.user);
      } catch (e) {
        createServiceError(
          "Echec de la récupération de l'utilisateur dans le P2002",
        );
      }
    }
    return null;
  }
}

function excludeField(user: any) {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

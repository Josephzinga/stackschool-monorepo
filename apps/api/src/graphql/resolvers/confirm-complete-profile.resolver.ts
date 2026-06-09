import {
  Context,
  ProfileData,
  RoleDataType,
  SchoolDataType,
} from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { redisClient } from '../../lib/redis';
import { createServiceError } from '../../utils/api-errors';
import { handleSchoolCreation } from '../../services/complete-profile/school.service';
import { handleRoleCreation } from '../../services/complete-profile/role.service';
import { handleProfileUpdate } from '../../services/complete-profile/profile.service';
import { clearUserFromRedis } from '../../lib/handle-redis-user';
import { Resolvers } from '../types.generated';

export const confirmCompleteProfileResolver: Resolvers = {
  Mutation: {
    confirmCompleteProfile: async (_: any, __: any, context: Context) => {
      const userId = context.user.id;
      const redisKey = `complete_profile:${userId}`;

      if (!userId) {
        throw createServiceError('Utilisateur non authentifié', 401);
      }

      try {
        const cachedData = await redisClient.get(redisKey);
        if (
          !cachedData ||
          cachedData === 'null' ||
          cachedData === 'undefined'
        ) {
          return {
            ok: false,
            message:
              'Aucune donnée de profil trouvée (Session expirée). Veuillez recommencer.',
          };
        }

        const { school, role, profile } = JSON.parse(cachedData) as {
          school: SchoolDataType;
          role: RoleDataType;
          profile: ProfileData;
        };

        await prisma.$transaction(async (tx) => {
          clearUserFromRedis(userId);

          await handleProfileUpdate(tx, userId, profile);

          const schoolId = await handleSchoolCreation(
            tx,
            userId,
            school,
            role.role,
          );

          await handleRoleCreation(tx, userId, schoolId, role);

          await tx.user.update({
            where: { id: userId },
            data: {
              profileCompleted: true,
              hasMembership: true,
            },
          });
        });

        await redisClient.del(redisKey);

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
            phoneNumber: true,
            hasMembership: true,
            profileCompleted: true,
            profile: {
              select: {
                id: true,
                photo: true,
                firstname: true,
                lastname: true,
                gender: true,
              },
            },
          },
        });

        return {
          ok: true,
          message: 'Profil finalisé avec succès',
          user: user as any,
        };
      } catch (error) {
        console.error(error);
        throw createServiceError(
          'Erreur lors de la finalisation du profil',
          500,
          error,
        );
      }
    },
  },
};

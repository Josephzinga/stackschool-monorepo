import {
  Context,
  ProfileData,
  RoleData,
  SchoolData,
} from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { redisClient } from '../../lib/redis';
import { createServiceError } from '../../utils/api-errors';
import { handleSchoolCreation } from '../../services/complete-profile/school.service';
import { handleRoleCreation } from '../../services/complete-profile/role.service';
import { handleProfileUpdate } from '../../services/complete-profile/profile.service';
import { clearUserFromRedis } from '../../lib/handle-redis-user';

export const confirmCompleteProfileResolver = {
  confirmCompleteProfile: async (_: any, context: Context) => {
    const userId = context.user.id;
    const redisKey = `complete_profile:${userId}`;

    try {
      // 1. Récupérer les données de Redis

      const cachedData = await redisClient.get(redisKey);

      // Vérification stricte
      if (!cachedData || cachedData === 'null' || cachedData === 'undefined') {
        return createServiceError(
          'Aucune donnée de profil trouvée (Session expirée). Veuillez recommencer.',
        );
      }

      const { school, role, profile } = JSON.parse(cachedData) as {
        school: SchoolData;
        role: RoleData;
        profile: ProfileData;
      };

      // 2. Transaction Prisma
      const data = await prisma.$transaction(async (tx) => {
        // A. Mise à jour du Profil (User + Profile)
        clearUserFromRedis(userId);

        await handleProfileUpdate(tx, userId, profile);

        // B. Gestion de l'école (Création ou Récupération ID)
        const schoolId = await handleSchoolCreation(
          tx,
          userId,
          school,
          role.role,
        );

        // C. Gestion du rôle et des données spécifiques
        await handleRoleCreation(tx, userId, schoolId, role);

        // D. Finalisation du User (Flag)
        await tx.user.update({
          where: { id: userId },
          data: {
            profileCompleted: true,
            hasMembership: true,
          },
        });
      });
      console.log('data', data);

      // 3. Nettoyage
      await redisClient.del(redisKey);

      return {
        ok: true,
        message: 'Profil finalisé avec succès',
        user: await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            hasMembership: true,
            profileCompleted: true,
            profile: {
              select: {
                photo: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        }),
      };
    } catch (error) {
      throw createServiceError(
        'Erreur lors de la finalisation du profil',
        500,
        error,
      );
    }
  },
};

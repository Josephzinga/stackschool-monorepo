import { Prisma } from '@stackschool/db';
import { ProfileData } from '@stackschool/shared';

type PrismaTx = Prisma.TransactionClient;

/**
 * Met à jour ou crée les informations de profil et d'utilisateur.
 *
 * @param tx - Le client de transaction Prisma.
 * @param userId - L'ID de l'utilisateur.
 * @param profileData - Les données du profil provenant de Redis (étape 1).
 */
export async function handleProfileUpdate(
  tx: PrismaTx,
  userId: string,
  profileData: ProfileData,
) {
  if (!profileData) return;

  // 1. Mise à jour des informations de compte (User)
  // On ne met à jour que si les champs sont présents
  const userDataToUpdate: any = {};

  if (profileData.email) userDataToUpdate.email = profileData.email;
  if (profileData.phoneNumber)
    userDataToUpdate.phoneNumber = profileData.phoneNumber;

  if (Object.keys(userDataToUpdate).length > 0) {
    await tx.user.update({
      where: { id: userId },
      data: userDataToUpdate,
    });
  }

  // 2. Upsert du Profil (Profile)
  // Crée le profil s'il n'existe pas, le met à jour sinon
  await tx.profile.upsert({
    where: { userId },
    create: {
      userId,
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      photo: profileData.photo,
      gender: profileData.gender,
    },
    update: {
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      photo: profileData.photo,
      gender: profileData.gender,
    },
  });
}

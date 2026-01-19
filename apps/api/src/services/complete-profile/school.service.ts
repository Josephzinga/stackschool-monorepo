import { GlobalRole, Prisma, SchoolRole } from '@stackschool/db';
import { SchoolData } from '@stackschool/shared';
import { createServiceError } from '../../utils/api-errors';

type PrismaTx = Prisma.TransactionClient;

/**
 * Gère la création ou la récupération de l'école lors de la finalisation du profil.
 *
 * @param tx - Le client de transaction Prisma.
 * @param userId - L'ID de l'utilisateur.
 * @param schoolData - Les données de l'école provenant de Redis.
 * @returns {Promise<string>} L'ID de l'école (nouvelle ou existante).
 */
export async function handleSchoolCreation(
  tx: PrismaTx,
  userId: string,
  schoolData: SchoolData,
  role: SchoolRole,
): Promise<string> {
  // Cas 1 : Création d'une nouvelle école
  if (schoolData.type === 'create') {
    const newSchool = await tx.school.create({
      data: {
        name: schoolData.newSchool.name,
        address: schoolData.newSchool.address,
        code: schoolData.newSchool.code,
        // On crée immédiatement le lien SchoolUser pour le créateur (ADMIN/OWNER)
        memberships: {
          create: {
            userId,
            role: 'ADMIN',
            isOwner: true,
          },
        },
      },
    });
    return newSchool.id;
  }

  console.log('SchoolData', schoolData);

  // Cas 2 : Rejoindre une école existante (via recherche ou invitation)
  if (schoolData.type === 'join') {
    const schoolUser = await tx.schoolUser.create({
      data: {
        schoolId: schoolData.schoolSelected.id as string,
        userId,
        role,
      },
    });
    console.log('schoolUser', schoolUser);
    // On vérifie juste que l'école existe toujours
    const school = await tx.school.findUnique({
      where: { id: schoolData.schoolSelected?.id },
    });

    if (!school) {
      throw createServiceError("L'école sélectionnée n'existe plus.");
    }
    return school.id;
  }

  throw createServiceError("Type d'action école invalide.");
}

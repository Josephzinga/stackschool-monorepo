import { Prisma, SchoolRole } from '@stackschool/db';
import { RoleData } from '@stackschool/shared';

type PrismaTx = Prisma.TransactionClient;

/**
 * Gère la création du rôle spécifique (Teacher, Student, Parent) et des liens associés.
 *
 * @param tx - Le client de transaction Prisma.
 * @param userId - L'ID de l'utilisateur.
 * @param schoolId - L'ID de l'école.
 * @param roleData - Les données du rôle provenant de Redis.
 */
export async function handleRoleCreation(
  tx: PrismaTx,
  userId: string,
  schoolId: string,
  roleData: RoleData,
) {
  const role = roleData.role as SchoolRole;
  console.log('schoolId', schoolId);

  // 1. Créer le SchoolUser de base (Membre de l'école)
  // Note: Si l'utilisateur a créé l'école, il est déjà ADMIN via handleSchoolCreation.
  // On doit vérifier pour ne pas créer de doublon ou gérer le cas ADMIN séparément.

  let schoolUser;

  // Si c'est une création d'école, le SchoolUser ADMIN a déjà été créé.
  // On le récupère pour potentiellement lui attacher d'autres infos si besoin,
  // mais généralement un ADMIN n'a pas de profil étendu complexe dans ce flux.
  const existingMember = await tx.schoolUser.findUnique({
    where: { schoolId_userId: { schoolId, userId } },
  });

  if (existingMember) {
    schoolUser = existingMember;
  } else {
    schoolUser = await tx.schoolUser.create({
      data: {
        userId,
        schoolId,
        role,
      },
    });
  }

  // 2. Créer l'entité spécifique selon le rôle
  switch (roleData.role) {
    case 'TEACHER':
      if (roleData.teacher) {
        const teacher = await tx.teacher.create({
          data: {
            schoolUserId: schoolUser.id,
            diploma: roleData.teacher.diploma,
            departement: roleData.teacher.department,
            isActive: true,
          },
        });

        // Gérer les assignations aux classes (ClassTeacher)
        if (
          roleData.teacher.assignments &&
          roleData.teacher.assignments.length > 0
        ) {
          for (const assignment of roleData.teacher.assignments) {
            // Créer le lien Prof <-> Classe
            await tx.classTeacher.create({
              data: {
                classId: assignment.classId,
                teacherId: teacher.id,
                staffMemberId: 'TEMP_ID', // TODO: Gérer staffMemberId si obligatoire ou le rendre optionnel
                // Si le prof est titulaire, on peut mettre à jour la classe (si le modèle le permet)
              },
            });

            // Si le prof enseigne des matières spécifiques dans cette classe
            // Note: Votre modèle actuel lie Subject à Class via ClassSubjects,
            // mais ne lie pas directement un Prof à une Matière DANS une classe via une table simple.
            // Si vous voulez dire "Ce prof enseigne Maths en 6ème A", il faudrait une relation.
            // Pour l'instant, on a juste lié le prof à la classe.
          }
        }
      }
      break;

    case 'STUDENT':
      const { id: profileId } = await tx.profile.findUniqueOrThrow({
        where: { userId },
      });
      const {
        matricule,
        motherName,
        fatherName,
        birthDate,
        nationality,
        enrollmentYear,
        classId,
        birthPlace,
      } = roleData.student;
      if (roleData.student) {
        const student = await tx.student.create({
          data: {
            schoolId,
            profileId,
            schoolUserId: schoolUser.id,
            matricule,
            motherName,
            fatherName,
            birthDate,
            birthPlace,
            nationality,
            enrollmentYear: enrollmentYear as string,
            classId,
          },
        });
        console.log('student', student);
      }
      break;

    case 'PARENT':
      if (roleData.parent) {
        const parent = await tx.parent.create({
          data: {
            schoolUserId: schoolUser.id,
            profession: roleData.parent.profession,
            address: roleData.parent.address,
            contactPreference: roleData.parent.contactPreference,
          },
        });

        // Lier les enfants
        if (roleData.parent.children && roleData.parent.children.length > 0) {
          for (const child of roleData.parent.children) {
            await tx.parentStudent.create({
              data: {
                parentId: parent.id,
                studentId: child.id,
                relationType: child.relation,
              },
            });
          }
        }
      }
      break;

    case 'ADMIN':
      // Rien de spécifique pour l'instant, le SchoolUser suffit
      break;
  }
}

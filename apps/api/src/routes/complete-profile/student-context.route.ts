import { Router } from 'express';
import { redisClient } from '../../lib/redis';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { isAuthenticated } from '../../middlewares/auth';
import {
  generatSuggestedMatricule,
  getCurrentAcademicYear,
} from '../../lib/generatedMatricule';

const router = Router();

router.get('/context', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const redisKey = `complete_profile:${userId}`;

    const progressData = await redisClient.get(redisKey);
    if (!progressData)
      return res.status(404).json({
        ok: false,
        message: 'Aucune progression trouver',
      });

    const { school, invitationCode } = JSON.parse(progressData);

    console.log('school', school, 'invitationCode', invitationCode);

    if (!school) {
      console.log('Aucune école sélectionnée');
      return res.status(400).json({
        ok: false,
        message: 'Aucune école sélectionnée',
      });
    }

    let schoolId;
    let schoolDetails;
    let classes = [];
    let existingStudent;

    switch (school.type) {
      case 'join':
        schoolId = school.schoolId;
        break;

      case 'invite':
        schoolId = school.schoolId;
        break;
      /*  if (invitationCode) {
          const invitation = await prisma.invite.findUnique({
            where: {
              token: invitationCode,
            },
          });
        }*/
    }

    schoolDetails = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        name: true,
        id: true,
        logo: true,
        code: true,
        classes: {
          select: {
            id: true,
            name: true,
            level: true,
            _count: {
              select: { students: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    console.log('schoolDetails', schoolDetails);
    if (!schoolDetails) {
      createServiceError('Ecole non trouvé', 404);
      return;
    }

    classes = schoolDetails.classes;
    const suggestMatricule = await generatSuggestedMatricule(schoolId);
    const academicYear = getCurrentAcademicYear();
    return res.json({
      ok: true,
      context: {
        school: {
          id: schoolDetails.id,
          name: schoolDetails.name,
          code: schoolDetails.code,
        },
        suggestMatricule,
        classes, // Si l'étudiant existe déjà (cas invitation)
        academicYear,
      },
    });
  } catch (e) {
    createServiceError('Erreur lors du chargement du contexte', 500, e);
  }
});
export default router;

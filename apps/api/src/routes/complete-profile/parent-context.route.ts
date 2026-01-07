import { Router } from 'express';
import { redisClient } from '../../lib/redis';
import { prisma } from '../../lib/prisma';
import { createServiceError } from '../../utils/api-errors';
import { isAuthenticated } from '../../middlewares/auth';

const router = Router();

router.get('/context', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const redisKey = `complete_profile:${userId}`;
    const progressData = await redisClient.get(redisKey);

    if (!progressData) {
      return res.status(404).json({
        ok: false,
        message: 'Aucune progression trouvée',
      });
    }

    const { school } = JSON.parse(progressData);
    console.log('school dans le contexte parent', school);
    if (!school || !school.schoolId) {
      return res.status(400).json({
        ok: false,
        message: 'Aucune école sélectionnée',
      });
    }
    const schoolDetails = await prisma.school.findUnique({
      where: {
        id: school.schoolId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        students: {
          where: { deletedAt: null },
          select: {
            id: true,
            matricule: true,
            profile: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
          orderBy: { matricule: 'asc' },
        },
      },
    });

    if (!schoolDetails) {
      return res.status(404).json({
        ok: false,
        message: 'Aucune école trouver',
      });
    }
    console.log('student schoolDetails', schoolDetails.students);
    const students = schoolDetails.students.map((student) => ({
      id: student.id,
      matricule: student.matricule,
      fullName:
        `${student.profile.firstname || ''} ${student.profile.lastname || ''}`.trim(),
    }));
    console.log('Students', students);

    return res.json({
      ok: true,
      context: {
        school: {
          id: schoolDetails.id,
          name: schoolDetails.name,
          code: schoolDetails.code,
        },
        students,
      },
    });
  } catch (e) {
    throw createServiceError('Erreur lors du chargement du contexte', 500, e);
  }
});

export default router;

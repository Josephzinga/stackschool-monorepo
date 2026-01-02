import { Router } from 'express';
import { createServiceError } from '../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { isAuthenticated } from '../../middlewares/auth';

const router = Router();

router.get('/:schoolId/classes', isAuthenticated, async (req, res) => {
  try {
    const schoolId = req.params.schoolId as string | undefined;
    if (!schoolId) {
      createServiceError("L'id manquant", 404);
      return;
    }
    const classes = await prisma.class.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        section: true,
        name: true,
        level: true,
        createdAt: true,
      },
    });
    if (!classes || classes.length <= 0) {
      return res
        .status(404)
        .json({ ok: false, message: 'Aucune classe trouvé' });
    }

    return res.status(200).json({ ok: true, classes: classes });
  } catch (e) {
    throw createServiceError('Erreur lors de la recherche des classes', 500, e);
  }
});

export default router;

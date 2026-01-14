import { Router } from 'express';
import { createServiceError } from '../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { isAuthenticated } from '../../middlewares/auth';

const router = Router();

router.get('/:schoolId/classes', isAuthenticated, async (req, res, next) => {
  try {
    const schoolId = req.params.schoolId as string | undefined;
    if (!schoolId) {
      return next(createServiceError("L'id manquant", 400));
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
      return res.status(200).json({ ok: true, classes: [] });
    }

    return res.status(200).json({ ok: true, classes });
  } catch (e) {
    next(createServiceError('Erreur lors de la recherche des classes', 500, e));
  }
});

export default router;

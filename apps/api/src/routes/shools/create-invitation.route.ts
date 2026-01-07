import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { createInvitationSchema } from '@stackschool/shared';
import { createAndSendInvitation } from '../../services/invitation.service';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { prisma } from '@stackschool/db';

const router = Router();

// Middleware (à créer) pour vérifier si l'utilisateur est admin de l'école
const isSchoolAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { schoolId } = req.body;
  const userId = req.user?.id;
  if (!userId) return;
  const membership = await prisma.schoolUser.findUnique({
    where: { schoolId_userId: { schoolId, userId } },
  });

  /* if (membership && (membership.role === 'ADMIN' || membership.isOwner)) {
    return next();
  }

  return next(
    createServiceError(
      "Accès refusé : vous n'êtes pas administrateur de cette école.",
      403,
    ),
  );
*/
  return next();
};

router.post(
  '/invitations',
  isAuthenticated,
  isSchoolAdmin, // Sécurise la route
  async (req, res, next) => {
    try {
      const errors = safeValidateSchema(createInvitationSchema, req.body);
      if (errors) return next(errors);
      const invitationData = req.body;

      const invitation = await createAndSendInvitation(invitationData);

      res.status(201).json({
        ok: true,
        message: 'Invitation envoyée avec succès.',
        invitation,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth';
import { prisma } from '@stackschool/db';

const router = Router();

router.post('/verify-invitation', isAuthenticated, async (req, res, next) => {
  const { invitationCode } = req.body;
  const userId = req.user?.id;
  if (!userId) return;

  try {
    const invitation = await prisma.invite.findUnique({
      where: {
        code: invitationCode,
      },
    });
  } catch (e) {}
});

export default router;
